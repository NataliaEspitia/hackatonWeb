import NavBar from "./componentes/navbar";
import BarraDeProgreso from "./componentes/BarraDeProgreso";
import Form from "./componentes/Form";
import Cronometro from "./componentes/Cronometro";
import GeneratorPassword from "./componentes/GeneratorPassword";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans">
      <main>
          <div className="rotate-180">
          <NavBar />
          </div>
          <h1 className="mt-10 text-center text-4xl font-bold text-gray-800">
            Hackathon Natalia Espitia
          </h1>
          <BarraDeProgreso />
          <Form />
          <Cronometro />
          <GeneratorPassword />
      </main>
    </div>
  );
}
