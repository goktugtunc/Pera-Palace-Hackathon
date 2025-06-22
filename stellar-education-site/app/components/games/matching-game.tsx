"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, RotateCcw, Zap } from "lucide-react"

interface MatchingGameProps {
  onComplete: (score: number) => void
}

interface MatchPair {
  id: string
  term: string
  definition: string
}

export default function MatchingGame({ onComplete }: MatchingGameProps) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null)
  const [matches, setMatches] = useState<{ [termId: string]: string }>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const pairs: MatchPair[] = [
    {
      id: "xlm",
      term: "XLM",
      definition: "Stellar ağının yerel para birimi (Lumens)",
    },
    {
      id: "trustline",
      term: "Trustline",
      definition: "Native olmayan varlıkları tutmak için gerekli güven hattı",
    },
    {
      id: "anchor",
      term: "Anchor",
      definition: "Gerçek dünya varlıklarını Stellar'a bağlayan kuruluş",
    },
    {
      id: "federation",
      term: "Federation",
      definition: "E-posta benzeri adreslerle Stellar hesaplarını eşleştirme",
    },
    {
      id: "scp",
      term: "SCP",
      definition: "Stellar Consensus Protocol - Ağın konsensüs mekanizması",
    },
    {
      id: "soroban",
      term: "Soroban",
      definition: "Stellar'ın akıllı kontrat platformu",
    },
  ]

  const shuffledDefinitions = [...pairs].sort(() => Math.random() - 0.5)

  const handleTermClick = (termId: string) => {
    if (matches[termId] || showResults) return
    setSelectedTerm(selectedTerm === termId ? null : termId)
  }

  const handleDefinitionClick = (definitionId: string) => {
    if (Object.values(matches).includes(definitionId) || showResults) return
    setSelectedDefinition(selectedDefinition === definitionId ? null : definitionId)
  }

  const makeMatch = () => {
    if (!selectedTerm || !selectedDefinition) return

    const newMatches = { ...matches }
    newMatches[selectedTerm] = selectedDefinition
    setMatches(newMatches)
    setSelectedTerm(null)
    setSelectedDefinition(null)
  }

  const removeMatch = (termId: string) => {
    const newMatches = { ...matches }
    delete newMatches[termId]
    setMatches(newMatches)
  }

  const checkAnswers = () => {
    let correctCount = 0
    Object.entries(matches).forEach(([termId, definitionId]) => {
      if (termId === definitionId) {
        correctCount++
      }
    })
    setScore(correctCount)
    setShowResults(true)
  }

  const resetGame = () => {
    setMatches({})
    setSelectedTerm(null)
    setSelectedDefinition(null)
    setShowResults(false)
    setScore(0)
  }

  const isCorrectMatch = (termId: string) => {
    return matches[termId] === termId
  }

  const getMatchedDefinition = (termId: string) => {
    const definitionId = matches[termId]
    return pairs.find((p) => p.id === definitionId)
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Kavram Eşleştirme Oyunu</CardTitle>
          <Badge variant="outline" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
            Stellar Terimleri
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Talimatlar */}
        <div className="bg-blue-400/10 border border-blue-400/20 p-4 rounded-lg">
          <p className="text-blue-300 text-sm">
            Sol taraftaki terimleri sağ taraftaki tanımlarla eşleştirin. Bir terim ve tanım seçtikten sonra "Eşleştir"
            butonuna tıklayın.
          </p>
        </div>

        {/* Eşleştirme alanı */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Terimler */}
          <div className="space-y-3">
            <h3 className="text-white font-medium">Terimler:</h3>
            {pairs.map((pair) => {
              const isMatched = matches[pair.id]
              const isSelected = selectedTerm === pair.id
              const isCorrect = showResults && isCorrectMatch(pair.id)
              const isIncorrect = showResults && isMatched && !isCorrectMatch(pair.id)

              return (
                <div
                  key={pair.id}
                  onClick={() => handleTermClick(pair.id)}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all
                    ${isMatched ? "opacity-50" : ""}
                    ${isSelected ? "border-purple-400 bg-purple-400/20" : "border-white/20"}
                    ${!isMatched && !isSelected ? "hover:border-white/40 hover:bg-white/10" : ""}
                    ${isCorrect ? "border-green-400 bg-green-400/20" : ""}
                    ${isIncorrect ? "border-red-400 bg-red-400/20" : ""}
                    ${showResults || isMatched ? "cursor-not-allowed" : ""}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{pair.term}</span>
                    {isMatched && !showResults && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeMatch(pair.id)
                        }}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    {showResults && isCorrect && <CheckCircle className="h-5 w-5 text-green-400" />}
                    {showResults && isIncorrect && <X className="h-5 w-5 text-red-400" />}
                  </div>
                  {isMatched && (
                    <div className="mt-2 text-sm text-gray-300">→ {getMatchedDefinition(pair.id)?.definition}</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Tanımlar */}
          <div className="space-y-3">
            <h3 className="text-white font-medium">Tanımlar:</h3>
            {shuffledDefinitions.map((pair) => {
              const isMatched = Object.values(matches).includes(pair.id)
              const isSelected = selectedDefinition === pair.id

              return (
                <div
                  key={`def-${pair.id}`}
                  onClick={() => handleDefinitionClick(pair.id)}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all
                    ${isMatched ? "opacity-50 cursor-not-allowed" : ""}
                    ${isSelected ? "border-purple-400 bg-purple-400/20" : "border-white/20"}
                    ${!isMatched && !isSelected ? "hover:border-white/40 hover:bg-white/10" : ""}
                    ${showResults ? "cursor-not-allowed" : ""}
                  `}
                >
                  <span className="text-white">{pair.definition}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Eşleştir butonu */}
        {selectedTerm && selectedDefinition && !showResults && (
          <div className="text-center">
            <Button
              onClick={makeMatch}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Eşleştir
            </Button>
          </div>
        )}

        {/* Sonuçlar */}
        {showResults && (
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-3">Sonuçlar:</h4>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">
                {score} / {pairs.length}
              </div>
              <div className="text-gray-300">Doğru eşleştirme</div>
            </div>
          </div>
        )}

        {/* Kontroller */}
        <div className="flex justify-between items-center">
          <div className="text-white">
            <span className="text-sm text-gray-300">Eşleştirilen: </span>
            <span className="font-bold">
              {Object.keys(matches).length} / {pairs.length}
            </span>
          </div>

          <div className="flex gap-2">
            {!showResults ? (
              <>
                <Button
                  variant="outline"
                  onClick={resetGame}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Sıfırla
                </Button>
                <Button
                  onClick={checkAnswers}
                  disabled={Object.keys(matches).length === 0}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Kontrol Et
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  const finalScore = Math.round((score / pairs.length) * 100)
                  onComplete(finalScore)
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Tamamla
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
