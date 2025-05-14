import Product from '../models/Product.js';

export const getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
};

export const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user._id,
      createdByEmail: req.user.email,
      updatedBy: req.user._id,
      updatedByEmail: req.user.email
    };
    const newProduct = await Product.create(productData);
    res.redirect('/admin/products?success=true');
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id,
        updatedByEmail: req.user.email
      },
      { new: true }
    );
    res.redirect('/admin/products?updated=true');
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};



export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/admin/products?deleted=true');
};

export const renderAdminProductList = async (req, res) => {
  const products = await Product.find().lean();
  res.render('admin/product-list', { products, user: req.user });
};

export const renderCreateProductForm = (req, res) => {
  res.render('admin/product-form', { user: req.user });
};

export const renderEditProductForm = async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  if (!product) return res.status(404).send('Producto no encontrado');
  res.render('admin/product-form', { product, edit: true, user: req.user });
};

