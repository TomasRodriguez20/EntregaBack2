import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import exphbs from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/carts.js';
import sessionRoutes from './routes/sessions.js';
import viewsRouter from './routes/viewsRouter.js';
import passport from './config/passport.js';
import adminProductsRouter from './routes/adminProducts.js';
import orderRoutes from './routes/order.js';


const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
connectDB();

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine(
  'handlebars',
  exphbs.engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      eq: (a, b) => a === b
    }
  })
);

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/admin/products', adminProductsRouter);
app.use('/order', orderRoutes);

app.use('/', viewsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});