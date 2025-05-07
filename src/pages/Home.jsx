import CardProducto from '../components/CardProducto';

function Home() {
  return (
    <div className="container mt-4">
        <h1>Productos Disponibles Prueba </h1>
        <CardProducto nombre="Pan Integral" precio="$500" />
        <CardProducto nombre="Pan normal" precio="$300" />
    </div>
  );
}

export default Home;