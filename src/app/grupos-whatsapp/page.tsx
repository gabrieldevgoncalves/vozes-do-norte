"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, MapPin, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function GruposWhatsAppPage() {
  const grupos = [
    {
      cidade: "Marabá",
      descricao: "Grupo oficial para participantes de Marabá e região",
      link: "https://chat.whatsapp.com/HLvLuXLvJbP0VAqyxW9Mt6",
    },
    {
      cidade: "Santarém",
      descricao: "Grupo oficial para participantes de Santarém e região",
      link: "https://chat.whatsapp.com/EFtRdI41eqYDtExdVkOTxd",
    },
    {
      cidade: "Benevides",
      descricao: "Grupo oficial para participantes de Benevides e região",
      link: "https://chat.whatsapp.com/HfXIju09BVdKNpkeReLTLc",
    },
    {
      cidade: "Portel",
      descricao: "Grupo oficial para participantes de Portel e região",
      link: "https://chat.whatsapp.com/HfXIju09BVdKNpkeReLTLc",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050444] to-[#0111F5] relative">
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="flex items-center">
            <img
              src="/images/festival-logo.png"
              alt="Festival da Música Gospel Paraense"
              className="h-12 w-12 md:h-16 md:w-16"
            />
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="border-[#FEB300] text-[#FEB300] hover:bg-[#FEB300] hover:text-[#050444] bg-transparent"
            >
              Voltar ao Início
            </Button>
          </Link>
        </nav>
      </header>

      <main className="relative z-10 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#FEB300] mb-4">Parabéns! 🎉</h2>
            <p className="text-xl text-white/90 mb-6">Sua inscrição foi realizada com sucesso!</p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Agora escolha o grupo do WhatsApp da sua cidade para receber todas as informações sobre o festival, datas
              das seletivas e muito mais.
            </p>
          </div>

          <div className="space-y-6">
            {grupos.map((grupo, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-[#FEB300] flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>{grupo.cidade}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-white">{grupo.descricao}</p>
                  </div>
                  <a href={grupo.link} target="_blank" rel="noopener noreferrer" className="ml-4">
                    <Button className="bg-[#25D366] hover:bg-[#25D366]/90 text-white">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Entrar no Grupo
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-12">
            <CardHeader>
              <CardTitle className="text-[#FEB300]">Informações Importantes</CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-3">
              <p>• Mantenha-se ativo no grupo da sua cidade para não perder nenhuma informação</p>
              <p>• As datas das seletivas regionais serão divulgadas em breve</p>
              <p>• Dúvidas gerais podem ser enviadas para qualquer um dos grupos</p>
              <p>• Respeite as regras do grupo e mantenha o foco no festival</p>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <p className="text-white/80 mb-4">Ainda tem dúvidas? Entre em contato conosco!</p>
            <Link href="/contatos">
              <Button
                variant="outline"
                className="border-[#FEB300] text-[#FEB300] hover:bg-[#FEB300] hover:text-[#050444] bg-transparent"
              >
                Ver Contatos
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
