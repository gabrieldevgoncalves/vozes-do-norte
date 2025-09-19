"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Star,
  Music,
  Award,
  Phone,
  Mail,
  MapPin,
  Users,
  Medal,
  CheckCircle,
  Calendar,
  FileText,
  Menu,
  X,
} from "lucide-react";

type ApiCity = {
  id: string;
  name: string;
  state: string;
};

type City = ApiCity & {
  slug: string;
};

interface ParticipantRequest {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  cityId: string;
  reason: string;
}

const toSlug = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

async function fetchCities(apiBase: string): Promise<City[]> {
  const res = await fetch(`${apiBase}/cities`, { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao carregar cidades");
  const data: ApiCity[] = await res.json();
  return data.map((c) => ({ ...c, slug: c?.name ? toSlug(c.name) : c.id }));
}

export default function HomePage() {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [stars, setStars] = useState<
    Array<{
      left: number;
      top: number;
      width: number;
      height: number;
      delay: number;
      duration: number;
    }>
  >([]);

  const [cities, setCities] = useState<City[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://api.festivaldamusicagospelparaense.com";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    cpf: "",
    dataNascimento: "",
    celular: "",
    email: "",
    cidade: "",
    testemunho: "",
    aceitoRegulamento: false,
  });

  const [ageValidation, setAgeValidation] = useState<{
    isValid: boolean;
    age: number;
    needsAuthorization: boolean;
    message: string;
  }>({
    isValid: true,
    age: 0,
    needsAuthorization: false,
    message: "",
  });

  useEffect(() => {
    const generatedStars = Array.from({ length: 150 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 1,
    }));
    setStars(generatedStars);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 100) {
        setIsNavVisible(true);
        clearTimeout(timeoutId);
      } else {
        timeoutId = setTimeout(() => {
          setIsNavVisible(false);
        }, 2000);
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoadingCities(true);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(`${API_BASE}/cities`, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          mode: "cors",
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data: ApiCity[] = await response.json();
          const withSlugs: City[] = data.map((c) => ({
            ...c,
            slug: toSlug(c.name),
          }));
          setCities(withSlugs);
          setErrorMessage("");
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err: unknown) {
        const fallbackBase: ApiCity[] = [
          {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Marabá",
            state: "PA",
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Santarém",
            state: "PA",
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440003",
            name: "Portel",
            state: "PA",
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440004",
            name: "Benevides",
            state: "PA",
          },
        ];
        const fallback: City[] = fallbackBase.map((c) => ({
          ...c,
          slug: toSlug(c.name),
        }));
        setCities(fallback);

        const msg =
          err instanceof Error
            ? err.name === "AbortError"
              ? "Tempo de conexão excedido ao carregar cidades."
              : err.message
            : "Erro desconhecido ao carregar cidades.";
        setErrorMessage(msg);
      } finally {
        setIsLoadingCities(false);
      }
    };

    load();
  }, [API_BASE]);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10)
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()))
      age--;
    return age;
  };

  const handleBirthDateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, dataNascimento: value }));
    if (!value) {
      setAgeValidation({
        isValid: true,
        age: 0,
        needsAuthorization: false,
        message: "",
      });
      return;
    }
    const age = calculateAge(value);
    if (age < 12) {
      setAgeValidation({
        isValid: false,
        age,
        needsAuthorization: false,
        message: "❌ Idade mínima para participação é de 12 anos completos.",
      });
    } else if (age > 100) {
      setAgeValidation({
        isValid: false,
        age,
        needsAuthorization: false,
        message: "❌ Idade não permitida.",
      });
    } else if (age < 18) {
      setAgeValidation({
        isValid: true,
        age,
        needsAuthorization: true,
        message:
          "⚠️ Menor de 18 anos: Será necessária autorização assinada pelo responsável legal no dia do evento.",
      });
    } else {
      setAgeValidation({
        isValid: true,
        age,
        needsAuthorization: false,
        message: "✅ Idade válida para participação.",
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
      setIsNavVisible(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a237e] relative overflow-hidden">
      <div
        className={`absolute inset-0 transition-opacity duration-500 opacity-100`}
      >
        {stars.map((star, i) => (
          <div
            key={i}
            className={`absolute bg-white rounded-full animate-pulse`}
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.width}px`,
              height: `${star.height}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-[#1a237e]/95 backdrop-blur-sm transition-transform duration-300 ${
          isNavVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center h-16">
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("sobre")}
                className="text-white hover:text-[#FEB300] transition-colors font-medium"
              >
                Sobre
              </button>
              <button
                onClick={() => scrollToSection("votacao")}
                className="text-white hover:text-[#FEB300] transition-colors font-medium"
              >
                Votação
              </button>
              <button
                onClick={() => scrollToSection("jurados")}
                className="text-white hover:text-[#FEB300] transition-colors font-medium"
              >
                Jurados
              </button>
              <button
                onClick={() => scrollToSection("regulamento")}
                className="text-white hover:text-[#FEB300] transition-colors font-medium"
              >
                Regulamento
              </button>
              <button
                onClick={() => scrollToSection("patrocinadores")}
                className="text-white hover:text-[#FEB300] transition-colors font-medium"
              >
                Patrocinadores
              </button>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-[#FEB300] transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden bg-[#0d1b69] border-t border-white/10">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => scrollToSection("sobre")}
                  className="block px-3 py-2 text-white hover:text-[#FEB300] transition-colors w-full text-left"
                >
                  Sobre
                </button>
                <button
                  onClick={() => scrollToSection("votacao")}
                  className="block px-3 py-2 text-white hover:text-[#FEB300] transition-colors w-full text-left"
                >
                  Votação
                </button>
                <button
                  onClick={() => scrollToSection("jurados")}
                  className="block px-3 py-2 text-white hover:text-[#FEB300] transition-colors w-full text-left"
                >
                  Jurados
                </button>
                <button
                  onClick={() => scrollToSection("regulamento")}
                  className="block px-3 py-2 text-white hover:text-[#FEB300] transition-colors w-full text-left"
                >
                  Regulamento
                </button>
                <button
                  onClick={() => scrollToSection("patrocinadores")}
                  className="block px-3 py-2 text-white hover:text-[#FEB300] transition-colors w-full text-left"
                >
                  Patrocinadores
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="relative z-10 h-screen flex items-center justify-center text-center px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FMGPs%20-%20COLOR-sY9YpWT3J6puIeF1dk1ZKQKwi3x8mc.png"
              alt="Festival da Música Gospel Paraense"
              className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto object-contain"
            />
          </div>

          <p className="text-base sm:text-xl lg:text-2xl text-white mb-2 sm:mb-3">
            O Maior Festival de Música Gospel do Pará
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-3 sm:mb-4 max-w-3xl mx-auto">
            O Pará vai cantar louvores e o Brasil vai parar pra ouvir
          </p>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 mb-6 sm:mb-8">
            Vote agora nos candidatos da sua cidade
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
            {cities.map((c) => (
              <Link key={c.slug} href={`/votacao/${c.slug}`}>
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10 text-xs sm:text-sm lg:text-base px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2"
                >
                  {c.name}
                </Button>
              </Link>
            ))}
            <Link href="/votacao/belem">
              <Button className="bg-[#FEB300] text-[#1a237e] hover:bg-[#FEB300]/90 font-bold text-xs sm:text-sm lg:text-base px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2">
                Grande Final em Belém
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section
        id="sobre"
        className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#FEB300] text-center mb-3 sm:mb-4">
            Sobre o Festival
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 text-center mb-8 sm:mb-12 lg:mb-16 max-w-4xl mx-auto">
            Um festival que conecta vozes, corações e cidades do Norte do Brasil
            em adoração e música.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-[#FEB300] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Music className="text-[#1a237e] h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#FEB300] mb-2">
                Revelação de Talentos
              </h3>
              <p className="text-white/90 text-xs sm:text-sm">
                Descobrindo e promovendo novos talentos da música gospel
                paraense
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-[#FEB300] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Medal className="text-[#1a237e] h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#FEB300] mb-2">
                Gravação Profissional
              </h3>
              <p className="text-white/90 text-xs sm:text-sm">
                O vencedor gravará sua música pela Gravadora Todah Music
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-[#FEB300] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="text-[#1a237e] h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#FEB300] mb-2">
                Comunidade
              </h3>
              <p className="text-white/90 text-xs sm:text-sm">
                Unindo artistas e adoradores de todo o estado do Pará
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-[#FEB300] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <MapPin className="text-[#1a237e] h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#FEB300] mb-2">
                4 Cidades + Final
              </h3>
              <p className="text-white/90 text-xs sm:text-sm">
                Benevides, Santarém, Portel, Marabá e grande final em Belém
              </p>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6">
              O que é o Festival da Música Gospel Paraense?
            </h3>
            <div className="space-y-3 sm:space-y-4 lg:space-y-6 text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-4xl mx-auto">
              <p>
                É o maior festival da música gospel do estado do Pará com o
                intuito de valorizar a música cristã e revelar para todo o
                Brasil a nova voz que assinará contrato com uma das maiores
                gravadoras gospel do Brasil, a Todah Music.
              </p>
              <p>
                Durante o festival, participantes de diferentes cidades do Pará
                se reunirão para competir de forma saudável e edificante, sempre
                priorizando a adoração e a comunhão. O evento culminará com uma
                grande final em Belém, onde o vencedor será escolhido e terá a
                oportunidade única de gravar profissionalmente sua música.
              </p>
              <p>
                Mais do que uma competição, o Festival da Música Gospel Paraense
                é um movimento de união, fé e celebração da rica tradição
                musical do Norte do Brasil.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="inscricao"
        className="relative z-10 py-8 sm:py-12 lg:py-16 px-4 sm:px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#FEB300] mb-4 sm:mb-6">
            Inscrições encerradas
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 lg:mb-12 max-w-3xl mx-auto">
            As inscrições para esta edição foram encerradas nas cidades de
            Benevides, Macapá e Santarém. Seguem abertas para a cidade de
            Portel.<br></br> Obrigado a todos que participaram!
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSd-Zv2NblV2qkCzf1qAaMOs2weyNH8_zt4bSnpt5vrbIdOyUg/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-[#FEB300] text-[#1a237e] font-semibold rounded-lg hover:bg-[#FEB300]/90 transition-colors duration-200 text-sm sm:text-base"
            >
              Inscrições para Portel
            </a>
          </div>
        </div>
      </section>

      <section
        id="jurados"
        className="relative z-10 py-16 sm:py-20 lg:py-24 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FEB300] mb-6 sm:mb-8">
              QUEM SERÃO OS JURADOS?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-4xl mx-auto">
              Cada cidade terá um quantitativo de{" "}
              <span className="text-[#FEB300] font-bold">5 a 7 jurados</span>,
              entre eles os representantes da gravadora e nomes da música gospel
              como:
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-8 sm:mb-12">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 lg:gap-16">
                <div className="text-center">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full mx-auto bg-gray-300 border-4 border-[#FEB300] overflow-hidden mb-4">
                    <img
                      src="/images/leandro-borges.png"
                      alt="Leandro Borges"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-sm sm:text-base lg:text-lg font-bold text-[#FEB300]">
                    LEANDRO
                    <br />
                    BORGES
                  </h4>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full mx-auto bg-gray-300 border-4 border-[#FEB300] overflow-hidden mb-4">
                    <img
                      src="/images/fernanda-brum.png"
                      alt="Fernanda Brum"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-sm sm:text-base lg:text-lg font-bold text-[#FEB300]">
                    FERNANDA
                    <br />
                    BRUM
                  </h4>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full mx-auto bg-gray-300 border-4 border-[#FEB300] overflow-hidden mb-4">
                    <img
                      src="/images/pr-lucas.png"
                      alt="Pastor Lucas"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-sm sm:text-base lg:text-lg font-bold text-[#FEB300]">
                    PASTOR
                    <br />
                    LUCAS
                  </h4>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full mx-auto bg-gray-300 border-4 border-[#FEB300] overflow-hidden mb-4">
                    <img
                      src="/images/andre-e-felipe.png"
                      alt="André e Felipe"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-sm sm:text-base lg:text-lg font-bold text-[#FEB300]">
                    ANDRÉ
                    <br />E FELIPE
                  </h4>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 md:mx-16">
                <div className="text-center">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full mx-auto bg-gray-300 border-4 border-[#FEB300] overflow-hidden mb-4">
                    <img
                      src="/images/esther-fiaux.png"
                      alt="Esther Fiaux"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-sm sm:text-base lg:text-lg font-bold text-[#FEB300]">
                    ESTHER
                    <br />
                    FIAUX
                  </h4>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full mx-auto bg-gray-300 border-4 border-[#FEB300] overflow-hidden mb-4">
                    <img
                      src="/images/quatro-por-um.png"
                      alt="Quatro Por Um"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-sm sm:text-base lg:text-lg font-bold text-[#FEB300]">
                    QUATRO
                    <br />
                    POR UM
                  </h4>
                </div>
                <div className="text-center col-span-2 md:col-span-1 mx-auto">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full mx-auto bg-gray-300 border-4 border-[#FEB300] overflow-hidden mb-4">
                    <img
                      src="/images/anderson-freire.png"
                      alt="Anderson Freire"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-sm sm:text-base lg:text-lg font-bold text-[#FEB300]">
                    ANDERSON
                    <br />
                    FREIRE
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="regulamento"
        className="relative z-10 py-16 sm:py-20 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-bold text-[#FEB300] text-center mb-4">
            Regulamento
          </h2>
          <p className="text-lg sm:text-xl text-white/90 text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
            Conheça as regras e critérios para participar do Festival da Música
            Paraense 2025
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="bg-[#0d1b69] rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FEB300] rounded-full flex items-center justify-center mr-4">
                  <Users className="text-[#1a237e] h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#FEB300]">
                  Requisitos de Participação
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="text-[#FEB300] h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">
                    Ser maior de 12 anos
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-[#FEB300] h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">
                    Residir ou não no estado do Pará
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-[#FEB300] h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">
                    Apresentar música gospel original ou cover
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-[#FEB300] h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">
                    Apresentações solo, dupla ou trio
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-[#FEB300] h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">
                    Não é permitido o uso de músicos próprios ou banda
                    particular
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#FEB300]/20">
                <a
                  href="/regulamento_festival_da_musica_gospel_paraense_oficial.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-[#FEB300] text-[#1a237e] font-semibold rounded-lg hover:bg-[#FEB300]/90 transition-colors duration-200 text-sm sm:text-base"
                >
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Confira o Regulamento Completo
                </a>
              </div>
            </div>

            <div className="bg-[#0d1b69] rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FEB300] rounded-full flex items-center justify-center mr-4">
                  <Award className="text-[#1a237e] h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#FEB300]">
                  Critérios de Avaliação
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="text-[#FEB300] h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">
                    Qualidade vocal, afinação e técnica
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-[#FEB300] h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">
                    Interpretação e expressão
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-[#FEB300] h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">
                    Presença de palco
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-[#FEB300] h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">
                    Conexão com o público
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-[#FEB300] h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">
                    Originalidade e criatividade
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-[#FEB300] h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">
                    Postura e Apresentação
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-[#FEB300] h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">
                    Confiança e Naturalidade
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-[#0d1b69] rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FEB300] rounded-full flex items-center justify-center mr-4">
                  <Calendar className="text-[#1a237e] h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#FEB300]">
                  Cronograma
                </h3>
              </div>
              <div className="space-y-4 text-white">
                <div>
                  <span className="font-bold text-[#FEB300]">
                    Votações Regionais:
                  </span>{" "}
                  Setembro 2025
                </div>
                <div>
                  <span className="font-bold text-[#FEB300]">
                    Grande Final:
                  </span>{" "}
                  Dezembro 2025 (Belém)
                </div>
                <div>
                  <span className="font-bold text-[#FEB300]">Gravação:</span>{" "}
                  Dezembro 2025
                </div>
              </div>
            </div>

            <div className="bg-[#FEB300] rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1a237e] rounded-full flex items-center justify-center mr-4">
                  <Medal className="text-[#FEB300] h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1a237e]">
                  Prêmio
                </h3>
              </div>
              <p className="text-[#1a237e] text-base sm:text-lg leading-relaxed">
                O vencedor do Festival da Música Paraense 2025 terá sua música
                gravada e lançada profissionalmente pela
                <span className="font-bold"> Gravadora Todah Music</span>, além
                de um contrato com a agência
                <span className="font-bold"> Vende Shows.</span>
                (do 2º ao 5º lugar terão premiação em dinheiro e troféu)
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="patrocinadores"
        className="bg-[#001489] text-white py-12 px-6"
      >
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFB800]">
              PATROCINADORES
            </h2>
            <p className="mt-2 text-lg">
              Agradecemos a todos os parceiros que tornam o Festival possível.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/images/pnab.png"
              alt="PNAB Aldir Blanc"
              width={200}
              height={80}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center mt-8">
            <div className="flex flex-col items-center">
              <span className="text-[#FFB800] font-semibold uppercase mb-2">
                Patrocínio Master
              </span>
              <Image
                src="/images/olival-marques.png"
                alt="Olival Marques"
                width={160}
                height={80}
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#FFB800] font-semibold uppercase mb-2">
                Patrocínio
              </span>
              <Image
                src="/images/josue-paiva.png"
                alt="Josué Paiva"
                width={260}
                height={120}
              />
            </div>
            <div className="flex justify-center">
              <Image
                src="/images/prefeitura-benevides.png"
                alt="Prefeitura de Benevides"
                width={260}
                height={80}
              />
            </div>
            <div className="flex justify-center">
              <Image
                src="/images/portel.png"
                alt="Prefeitura de Portel"
                width={260}
                height={120}
                className="object-contain"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mt-12">
            <div className="flex flex-col items-center">
              <span className="text-[#FFB800] font-semibold uppercase mb-2">
                Apoio
              </span>
              <Image
                src="/images/governo-do-para.png"
                alt="Governo do Pará"
                width={260}
                height={120}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#FFB800] font-semibold uppercase mb-2">
                Realização
              </span>
              <Image
                src="/images/vende-shows.png"
                alt="Vende Shows"
                width={140}
                height={60}
              />
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="/images/ministerio-da-cultura.png"
                alt="Ministério da Cultura"
                width={260}
                height={120}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-[#0d1b69] rounded-3xl p-8 sm:p-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-6">
              Quer ser nosso parceiro?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8">
              Junte-se a nós nesta celebração da música gospel paraense e ajude
              a revelar novos talentos.
            </p>
            <Link href="/contatos">
              <Button className="bg-[#FEB300] text-[#1a237e] hover:bg-[#FEB300]/90 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold">
                Entre em Contato
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-[#0a1357] py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <img
                  src="/images/festival-logo.png"
                  alt="Festival da Música Gospel Paraense"
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
              </div>
              <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-6">
                O maior festival de música gospel do Pará, revelando novos
                talentos e celebrando a fé através da música. Uma oportunidade
                única para artistas locais brilharem no cenário nacional.
              </p>
            </div>
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-[#FEB300] mb-6">
                Contato
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="text-[#FEB300] h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">
                      Telefone
                    </p>
                    <p className="text-white/80 text-sm sm:text-base">
                      (91) 99371-4669
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="text-[#FEB300] h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">
                      E-mail
                    </p>
                    <p className="text-white/80 text-sm sm:text-base">
                      amaismusicoficial@mail.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-[#FEB300] h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">
                      Horário
                    </p>
                    <p className="text-white/80 text-sm sm:text-base">
                      Seg-Sex: 7:00 - 18:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-[#FEB300] mb-6">
                Equipe
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">
                    Produtor do Evento
                  </p>
                  <p className="text-white/80 text-sm sm:text-base">
                    @arlonoliveira
                  </p>
                </div>
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">
                    Entretenimento
                  </p>
                  <p className="text-white/80 text-sm sm:text-base">
                    @vendeshows
                  </p>
                </div>
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">
                    Realização
                  </p>
                  <p className="text-white/80 text-sm sm:text-base">
                    Amais Music Entretenimento
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-white/60 mb-4 md:mb-0 text-sm sm:text-base">
              © 2025 Festival da Música Gospel Paraense. Todos os direitos
              reservados.
            </p>
            <p className="text-white/60 text-xs sm:text-sm mt-2">
              Festival de Música Gospel do Pará - Setembro 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
