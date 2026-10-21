import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';

// Tienda
import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx';
import Categorias from './pages/Categorias.jsx';
import Ofertas from './pages/Ofertas.jsx';
import Carrito from './pages/Carrito.jsx';
import Checkout from './pages/Checkout.jsx';
import PagoCorrecto from './pages/PagoCorrecto.jsx';
import PagoError from './pages/PagoError.jsx';
import Blogs from './pages/Blogs.jsx';
import BlogDetalle from './pages/BlogDetalle.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Contacto from './pages/Contacto.jsx';
import InicioSesion from './pages/InicioSesion.jsx';
import RegistroUsuario from './pages/RegistroUsuario.jsx';

// Administrador
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminOrdenes from './pages/admin/AdminOrdenes.jsx';
import AdminBoleta from './pages/admin/AdminBoleta.jsx';
import AdminProductos from './pages/admin/AdminProductos.jsx';
import AdminProductosCriticos from './pages/admin/AdminProductosCriticos.jsx';
import AdminReporteProductos from './pages/admin/AdminReporteProductos.jsx';
import NuevoProducto from './pages/NuevoProducto.jsx';
import EditarProducto from './pages/EditarProducto.jsx';
import AdminCategorias from './pages/admin/AdminCategorias.jsx';
import AdminCategoriaForm from './pages/admin/AdminCategoriaForm.jsx';
import AdminUsuarios from './pages/admin/AdminUsuarios.jsx';
import NuevoUsuario from './pages/NuevoUsuario.jsx';
import EditarUsuario from './pages/EditarUsuario.jsx';
import AdminHistorialCompras from './pages/admin/AdminHistorialCompras.jsx';
import AdminReportes from './pages/admin/AdminReportes.jsx';
import AdminPerfil from './pages/admin/AdminPerfil.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/detalle-producto" element={<DetalleProducto />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pago-correcto/:orderId" element={<PagoCorrecto />} />
        <Route path="/pago-error/:orderId" element={<PagoError />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetalle />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<InicioSesion />} />
        <Route path="/registro" element={<RegistroUsuario />} />
        <Route path="*" element={<Home />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="ordenes" element={<AdminOrdenes />} />
        <Route path="ordenes/:id" element={<AdminBoleta />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="productos/nuevo" element={<NuevoProducto />} />
        <Route path="productos/editar" element={<EditarProducto />} />
        <Route path="productos/criticos" element={<AdminProductosCriticos />} />
        <Route path="productos/reportes" element={<AdminReporteProductos />} />
        <Route path="categorias" element={<AdminCategorias />} />
        <Route path="categorias/nueva" element={<AdminCategoriaForm />} />
        <Route path="categorias/editar" element={<AdminCategoriaForm isEdit />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="usuarios/nuevo" element={<NuevoUsuario />} />
        <Route path="usuarios/editar" element={<EditarUsuario />} />
        <Route path="usuarios/historial" element={<AdminHistorialCompras />} />
        <Route path="reportes" element={<AdminReportes />} />
        <Route path="perfil" element={<AdminPerfil />} />
      </Route>
    </Routes>
  );
}
