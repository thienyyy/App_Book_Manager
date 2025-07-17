import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { addBook } from '../../api/book';
import { TextInput, Button, Snackbar } from 'react-native-paper';

export default function AddBookScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  return (
    <Formik
      initialValues={{
        title: '',
        author: '',
        price: '',
        description: '',
        category: '',
        stock: '',
        image: '',
      }}
      validationSchema={Yup.object({
        title: Yup.string().required('Book title is required'),
        author: Yup.string().required('Author is required'),
        price: Yup.number().required('Price is required').min(0),
        category: Yup.string().required('Category is required'),
        stock: Yup.number().min(0, 'Stock must be at least 0'),
      })}
      onSubmit={async (values, { resetForm }) => {
        try {
          setLoading(true);
          await addBook(values);
          resetForm();
          navigation.goBack();
        } catch (error) {
          setSnackbar({ visible: true, message: 'Failed to add book. Please try again.' });
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ handleChange, handleSubmit, values, errors, touched }) => (
        <View style={styles.form}>
          <TextInput label="Title" mode="outlined" value={values.title} onChangeText={handleChange('title')} style={styles.input} />
          {touched.title && errors.title && <Text style={styles.error}>{errors.title}</Text>}

          <TextInput label="Author" mode="outlined" value={values.author} onChangeText={handleChange('author')} style={styles.input} />
          {touched.author && errors.author && <Text style={styles.error}>{errors.author}</Text>}

          <TextInput label="Price" mode="outlined" keyboardType="numeric" value={values.price} onChangeText={handleChange('price')} style={styles.input} />
          {touched.price && errors.price && <Text style={styles.error}>{errors.price}</Text>}

          <TextInput label="Category" mode="outlined" value={values.category} onChangeText={handleChange('category')} style={styles.input} />
          {touched.category && errors.category && <Text style={styles.error}>{errors.category}</Text>}

          <TextInput label="Stock" mode="outlined" keyboardType="numeric" value={values.stock} onChangeText={handleChange('stock')} style={styles.input} />

          <TextInput label="Description" mode="outlined" multiline value={values.description} onChangeText={handleChange('description')} style={styles.input} />

          <TextInput label="Image URL (optional)" mode="outlined" value={values.image} onChangeText={handleChange('image')} style={styles.input} />

          <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading}>Add Book</Button>

          <Snackbar visible={snackbar.visible} onDismiss={() => setSnackbar({ visible: false, message: '' })}>
            {snackbar.message}
          </Snackbar>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  form: { padding: 20 },
  input: { marginBottom: 12 },
  error: { color: 'red', fontSize: 13, marginBottom: 10 },
});
