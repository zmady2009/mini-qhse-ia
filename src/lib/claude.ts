import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function chatWithClaude(
  message: string, 
  context?: { sector?: string; organizationName?: string }
) {
  try {
    const systemPrompt = `Tu es un expert QHSE (Qualité, Hygiène, Sécurité, Environnement) pour le marché africain.
${context?.sector ? `Tu aides une entreprise du secteur: ${context.sector}.` : ''}
${context?.organizationName ? `Nom de l'organisation: ${context.organizationName}.` : ''}

Tes réponses doivent être:
- Pratiques et actionnables
- Adaptées aux PME africaines
- Concises (max 300 mots)
- En français

Tu peux aider à:
- Rédiger des procédures QHSE
- Analyser des risques
- Conseiller sur la conformité
- Générer des checklists`

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: message }]
    })

    return {
      success: true,
      response: response.content[0].type === 'text' ? response.content[0].text : 'Désolé, je ne peux pas répondre.'
    }
  } catch (error) {
    console.error("Claude API error:", error)
    return {
      success: false,
      error: "Service IA temporairement indisponible"
    }
  }
}

export async function suggestPriorityAndDueDate(title: string, description?: string) {
  try {
    const prompt = `Analyse cette action QHSE et suggère une priorité et délai:
Titre: ${title}
Description: ${description || 'Aucune'}

Réponds uniquement au format JSON:
{
  "priority": "low|medium|high|critical",
  "suggestedDays": number,
  "reason": "brève explication"
}`

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }]
    })

    const content = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return { priority: 'medium', suggestedDays: 7, reason: 'Délai par défaut' }
  } catch (error) {
    return { priority: 'medium', suggestedDays: 7, reason: 'Délai par défaut' }
  }
}
