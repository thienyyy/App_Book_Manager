import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  ActivityIndicator,
  Switch,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createBook } from "../../api/book";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddBookScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    image: "",
    category: "",
    stock: "",
    isActive: true,
    favorites: [],
    pages: [{ pageNumber: 1, content: "" }],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (index, field, value) => {
    setForm((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[index] = {
        ...updatedPages[index],
        [field]: field === "pageNumber" ? Number(value) : value,
      };
      return { ...prev, pages: updatedPages };
    });
  };

  const addNewPage = () => {
    setForm((prev) => ({
      ...prev,
      pages: [
        ...prev.pages,
        { pageNumber: prev.pages.length + 1, content: "" },
      ],
    }));
  };

  const removePage = (index) => {
    if (form.pages.length === 1) {
      return Alert.alert("Lỗi", "Phải có ít nhất một trang.");
    }
    setForm((prev) => ({
      ...prev,
      pages: prev.pages.filter((_, i) => i !== index),
    }));
  };

  const pickImage = async () => {
    try {
      console.log("[DEBUG] Requesting media library permissions");
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        console.log("[DEBUG] Permission denied");
        return Alert.alert(
          "Quyền bị từ chối",
          "Cần quyền truy cập thư viện ảnh để chọn ảnh."
        );
      }

      console.log("[DEBUG] Launching image picker");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      console.log(
        "[DEBUG] Image picker result:",
        JSON.stringify(result, null, 2)
      );

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const fileType = uri.split(".").pop().toLowerCase();
        if (!["jpg", "jpeg", "png"].includes(fileType)) {
          console.log("[DEBUG] Invalid file type:", fileType);
          return Alert.alert("Lỗi", "Chỉ hỗ trợ định dạng JPG, JPEG hoặc PNG.");
        }
        setForm((prev) => ({ ...prev, image: uri }));
        console.log("[DEBUG] Image selected:", uri);
      } else {
        console.log("[DEBUG] Image picker canceled");
      }
    } catch (error) {
      console.error("[ERROR] Image picker error:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi chọn ảnh.");
    }
  };

  const handleSubmit = async () => {
    const {
      title,
      author,
      price,
      description,
      category,
      stock,
      isActive,
      favorites,
      pages,
    } = form;

    if (!title || !author || !price || !description || !category || !stock) {
      return Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc.");
    }

    if (isNaN(price) || parseFloat(price) < 0) {
      return Alert.alert("Lỗi", "Giá sách phải là số không âm.");
    }

    if (isNaN(stock) || parseInt(stock) < 0) {
      return Alert.alert("Lỗi", "Số lượng phải là số nguyên không âm.");
    }

    if (pages.some((page) => !page.pageNumber || !page.content)) {
      return Alert.alert(
        "Lỗi",
        "Tất cả các trang phải có số trang và nội dung."
      );
    }

    const pageNumbers = pages.map((page) => Number(page.pageNumber));
    if (new Set(pageNumbers).size !== pageNumbers.length) {
      return Alert.alert("Lỗi", "Số trang phải là duy nhất.");
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("[DEBUG] Token:", token);
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("price", parseFloat(price));
      formData.append("description", description);
      formData.append("category", category);
      formData.append("stock", parseInt(stock));
      formData.append("isActive", isActive.toString());
      formData.append("favorites", JSON.stringify(favorites));
      formData.append(
        "pages",
        JSON.stringify(
          pages.map((page) => ({
            pageNumber: Number(page.pageNumber),
            content: page.content,
          }))
        )
      );

      if (form.image) {
        const uriParts = form.image.split(".");
        const fileType = uriParts[uriParts.length - 1].toLowerCase();
        formData.append("image", {
          uri:
            Platform.OS === "android"
              ? form.image
              : form.image.replace("file://", ""),
          name: `book_image.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      console.log(
        "[DEBUG] Sending FormData:",
        JSON.stringify(formData._parts, null, 2)
      );
      const response = await createBook(formData);
      const res = response?.data || response;

      if (res.success) {
        Alert.alert("Thành công", "Đã thêm sách thành công!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
        setForm({
          title: "",
          author: "",
          price: "",
          description: "",
          image: "",
          category: "",
          stock: "",
          isActive: true,
          favorites: [],
          pages: [{ pageNumber: 1, content: "" }],
        });
      } else {
        console.log("[DEBUG] API error:", res.message);
        Alert.alert("Lỗi", res.message || "Thêm sách thất bại.");
      }
    } catch (error) {
      console.error(
        "[ERROR] Create book error:",
        error.message,
        error.config || {},
        error.response?.data || {}
      );
      if (error.message === "No authentication token found") {
        Alert.alert("Lỗi xác thực", "Vui lòng đăng nhập lại để tiếp tục.");
      } else if (error.code === "ERR_NETWORK") {
        Alert.alert(
          "Lỗi mạng",
          "Không thể kết nối đến server tại http://172.16.40.25:3000. Vui lòng kiểm tra kết nối mạng hoặc server."
        );
      } else if (error.response) {
        Alert.alert(
          "Lỗi server",
          `Server trả về lỗi: ${error.response.status} - ${
            error.response.data.message || "Không xác định"
          }`
        );
      } else {
        Alert.alert("Lỗi", `Đã xảy ra lỗi khi thêm sách: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.header}>Thêm Sách Mới</Text>

      <Text style={styles.label}>Tên sách</Text>
      <TextInput
        style={styles.input}
        value={form.title}
        onChangeText={(value) => handleChange("title", value)}
        autoCapitalize="sentences"
      />

      <Text style={styles.label}>Tác giả</Text>
      <TextInput
        style={styles.input}
        value={form.author}
        onChangeText={(value) => handleChange("author", value)}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Giá</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.price}
        onChangeText={(value) => handleChange("price", value)}
        inputMode="numeric"
      />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
        value={form.description}
        onChangeText={(value) => handleChange("description", value)}
        autoCapitalize="sentences"
      />

      <Text style={styles.label}>Thể loại</Text>
      <TextInput
        style={styles.input}
        value={form.category}
        onChangeText={(value) => handleChange("category", value)}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Số lượng</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.stock}
        onChangeText={(value) => handleChange("stock", value)}
        inputMode="numeric"
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Trạng thái hoạt động</Text>
        <Switch
          value={form.isActive}
          onValueChange={(value) => handleChange("isActive", value)}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={form.isActive ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      <Text style={styles.label}>Ảnh bìa</Text>
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>📷 Chọn ảnh bìa</Text>
      </TouchableOpacity>
      {form.image ? (
        <Image
          source={{
            uri:
              Platform.OS === "android"
                ? form.image
                : form.image.replace("file://", ""),
          }}
          style={styles.imagePreview}
        />
      ) : (
        <Text style={styles.noImageText}>Chưa chọn ảnh</Text>
      )}

      <Text style={styles.label}>Danh sách trang</Text>
      {form.pages.map((page, index) => (
        <View key={index} style={styles.pageContainer}>
          <Text style={styles.label}>Số trang</Text>
          <TextInput
            style={styles.input}
            placeholder="Số trang"
            keyboardType="numeric"
            value={page.pageNumber?.toString() || ""}
            onChangeText={(val) => handlePageChange(index, "pageNumber", val)}
            inputMode="numeric"
          />
          <Text style={styles.label}>Nội dung trang</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={`Nội dung trang ${page.pageNumber}`}
            multiline
            numberOfLines={4}
            value={page.content || ""}
            onChangeText={(val) => handlePageChange(index, "content", val)}
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removePage(index)}
          >
            <Text style={styles.removeButtonText}>Xóa trang</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addNewPage}>
        <Text style={styles.addButtonText}>➕ Thêm trang</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="📚 Thêm sách" onPress={handleSubmit} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: "#6200EE",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  noImageText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
  },
  pageContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#FF4444",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AddBookScreen;
