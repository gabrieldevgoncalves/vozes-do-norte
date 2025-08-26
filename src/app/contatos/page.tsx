"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function ContatosPage() {
  const [stars, setStars] = useState<Array<{ left: number; top: number; delay: number; duration: number }>>([])

  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    }))
    setStars(generatedStars)
  }, [])

  return (
    <div className="h-screen bg-gradient-to-br from-[#050444] to-[#0111F5] relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      <header className="relative z-10 p-4">
        <nav className="flex justify-end max-w-7xl mx-auto">
          <Link href="/">
            <Button
              variant="outline"
              className="border-[#FEB300] text-[#FEB300] hover:bg-[#FEB300] hover:text-[#050444] bg-transparent text-sm"
            >
              Voltar ao Início
            </Button>
          </Link>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-4">
        <div className="text-center max-w-2xl mx-auto flex flex-col justify-center h-full">
          <div className="mb-8">
            <Image
              src="/images/festival-logo.png"
              alt="Festival da Música Gospel Paraense"
              width={200}
              height={200}
              className="mx-auto w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
            />
          </div>

          <div className="space-y-4 text-white text-base md:text-lg lg:text-xl">
            <div>
              <span className="font-bold">CONTATO:</span> (91) 99371-4669
            </div>

            <div>
              <span className="font-bold">E-MAIL:</span> AMAISMUSICOFICIAL@GMAIL.COM
            </div>

            <div>
              <span className="font-bold">HORÁRIO:</span> SEG-SEX: 7:00 - 18:00
            </div>

            <div>
              <span className="font-bold">PRODUTOR DO EVENTO:</span> @ARLONOLIVEIRA
            </div>

            <div>
              <span className="font-bold">AMAISMUSIC ENTRETENIMENTO:</span> @AMAISMUSIC
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
