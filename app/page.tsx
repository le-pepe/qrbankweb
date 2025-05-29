"use client";

import {useState} from 'react';
import {Menu, Moon, QrCode, RefreshCw, Shield, Smartphone, UserCircle2, X} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ModeToggle} from "@/components/ModeToggle";
import {SignedIn, SignedOut, SignInButton, SignUpButton, UserButton} from "@clerk/nextjs";
import Link from "next/link";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("features");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
      <div className="min-h-screen flex flex-col w-full">
        {/* Navbar */}
        <nav className="bg-background border-b sticky top-0 w-full z-50">
          <div className="w-full flex justify-between items-center py-4 px-6">
            <div className="flex items-center space-x-2">
              <div>
                <Link href="/" className="flex items-center space-x-2">
                  <QrCode className="text-primary h-6 w-6" />
                  <span className="text-xl font-bold">BanQR</span>
                </Link>
              </div>
            </div>
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/#features">Características</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/#how-it-works">Cómo funciona</Link>
              </Button>
              <ModeToggle />
              <SignedOut>
                <SignInButton>
                  <Button>Iniciar Sesión</Button>
                </SignInButton>
                <SignUpButton>
                  <Button variant="secondary">Crear cuenta</Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton/>
              </SignedIn>
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <ModeToggle />
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="ml-2">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-background border-t">
              <div className="flex flex-col items-center space-y-2 py-4">
                <Button variant="ghost" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/#features">Características</Link>
                </Button>
                <Button variant="ghost" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/#how-it-works">Cómo funciona</Link>
                </Button>
                <SignedOut>
                  <SignInButton>
                    <Button className="w-full max-w-xs" onClick={() => setIsMobileMenuOpen(false)}>Iniciar Sesión</Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button variant="secondary" className="w-full max-w-xs" onClick={() => setIsMobileMenuOpen(false)}>Crear cuenta</Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <div className="w-full flex justify-center">
                    <UserButton afterSignOutUrl="/"/>
                  </div>
                </SignedIn>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent text-white py-20 w-full">
          <div className="container px-6 text-center mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Gestiona tus cuentas bancarias fácilmente</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90 text-pretty">
              Almacena, comparte y administra tus datos bancarios de forma segura con tecnología QR
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="px-8 py-6 text-lg" asChild>
                <Link href="/home">Comenzar</Link>
              </Button>
            </div>
            <div className="mt-16 bg-background rounded-xl shadow-xl max-w-4xl mx-auto overflow-hidden">
              <div className="w-full h-80 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">App Preview</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="flex-1">
          {/* Features Section */}
          <section id="features" className="py-20 bg-muted/50 w-full">
            <div className="container px-6 mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                Características principales
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                    icon={<UserCircle2 className="h-10 w-10" />}
                    title="Mis Cuentas"
                    description="Almacena y gestiona todas tus cuentas bancarias en un solo lugar. Organízalas por banco, tipo de cuenta y más."
                    color="text-blue-600"
                />

                <FeatureCard
                    icon={<RefreshCw className="h-10 w-10" />}
                    title="Otras Cuentas"
                    description="Guarda cuentas de contactos frecuentes para transferencias rápidas. Comparte tus datos fácilmente mediante QR."
                    color="text-emerald-600"
                />

                <FeatureCard
                    icon={<QrCode className="h-10 w-10" />}
                    title="Tecnología QR"
                    description="Comparte tus datos bancarios de forma segura escaneando códigos QR. Sin errores al ingresar datos manualmente."
                    color="text-purple-600"
                />

                <FeatureCard
                    icon={<Shield className="h-10 w-10" />}
                    title="Seguridad"
                    description="Tus datos están protegidos con autenticación de usuario. Solo tú puedes acceder a tu información."
                    color="text-yellow-600"
                />

                <FeatureCard
                    icon={<Smartphone className="h-10 w-10" />}
                    title="Acceso Rápido"
                    description="Interfaz optimizada para móviles con botones de acción rápida. Accede a tus datos en cualquier momento."
                    color="text-red-600"
                />

                <FeatureCard
                    icon={<Moon className="h-10 w-10" />}
                    title="Modo Oscuro"
                    description="Diseño adaptable a tus preferencias de visualización. Reduce la fatiga visual en condiciones de poca luz."
                    color="text-indigo-600"
                />
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-20 w-full">
            <div className="container px-6 mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                Cómo funciona BanQR
              </h2>

              <StepSection
                  step={1}
                  title="Agrega tus cuentas"
                  description="Registra fácilmente tus cuentas bancarias con todos los detalles necesarios: nombre, RUT, banco, tipo de cuenta y número."
                  items={[
                    "Cuentas vista, corriente o ahorro",
                    "Agrega alias para identificarlas fácilmente",
                    "Organiza por bancos y tipos"
                  ]}
                  color="bg-blue-600"
                  reverse={false}
              />

              <StepSection
                  step={2}
                  title="Comparte con QR"
                  description="Genera códigos QR para cada una de tus cuentas y compártelos de forma segura con quien necesites."
                  items={[
                    "Muestra el QR para que otros escaneen",
                    "Sin errores al ingresar datos manualmente",
                    "Comparte solo la información necesaria"
                  ]}
                  color="bg-emerald-600"
                  reverse={true}
              />

              <StepSection
                  step={3}
                  title="Importa cuentas externas"
                  description="Escanea códigos QR de otras personas para guardar sus datos bancarios de forma rápida y sin errores."
                  items={[
                    "Guarda cuentas de contactos frecuentes",
                    "Acceso rápido para futuras transferencias",
                    "Organiza por nombre o relación"
                  ]}
                  color="bg-purple-600"
                  reverse={false}
              />
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-primary text-primary-foreground w-full">
            <div className="container px-6 text-center mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Simplifica tu vida bancaria</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Únete a BanQR hoy y olvídate de los errores al compartir tus datos bancarios
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <SignUpButton>
                    <Button variant="secondary" className="px-8 py-6 text-lg">
                      Crear cuenta gratis
                    </Button>
                </SignUpButton>
                <Button variant="outline" className="border-2 border-white hover:bg-white/10 px-8 py-6 text-lg" asChild>
                  {/* Podrías enlazar esto a una sección de demostración o una página modal */}
                  <Link href="/#how-it-works">Ver demostración</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-background border-t w-full">
          <div className="container px-6 py-12 mx-auto">
            {/* He eliminado un div redundante y ajustado el margen superior */}
            <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground mb-4 md:mb-0">
                © {new Date().getFullYear()} BanQR. Todos los derechos reservados.
              </p>
              {/* Podrías añadir enlaces al pie de página aquí si es necesario */}
              {/* <div className="flex space-x-4">
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacidad</Link>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">Términos</Link>
              </div> */}
            </div>
          </div>
        </footer>
      </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className={`${color} mb-4`}>
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
  );
}

interface StepSectionProps {
  step: number;
  title: string;
  description: string;
  items: string[];
  color: string;
  reverse: boolean;
}

function StepSection({ step, title, description, items, color, reverse }: StepSectionProps) {
  return (
      <div className={`flex flex-col md:flex-row items-center gap-12 mb-16 ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <div className="md:w-1/2">
          <div className={`${color} text-white mb-4 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold`}>
            {step}
          </div>
          <h3 className="text-2xl font-semibold mb-4">{title}</h3>
          <p className="text-muted-foreground mb-4">
            {description}
          </p>
          <ul className="text-muted-foreground space-y-2">
            {items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mt-1 mr-2">✓</span>
                  <span>{item}</span>
                </li>
            ))}
          </ul>
        </div>
        <div className="md:w-1/2">
          <div className="bg-muted rounded-xl shadow-lg w-full h-64 flex items-center justify-center">
            <span className="text-muted-foreground">Step {step} Illustration</span>
          </div>
        </div>
      </div>
  );
}
