import { DISEASE_DATABASE, HOSPITALS, HEALTH_TIPS, MEDICATIONS } from '../data/knowledgeBase';
import { getHealthcareIndex, getHealthcareMeta } from './healthcareDataset';

export const processInput = (text) => {
  const lowerText = text.toLowerCase();
  
  // 0. Dataset status / connectivity check
  if (
    lowerText.includes('dataset') ||
    lowerText.includes('csv') ||
    lowerText.includes('kaggle')
  ) {
    const meta = getHealthcareMeta();
    if (meta.loaded && !meta.error) {
      return `✅ Healthcare dataset is connected.\n\n- Rows: ${meta.rowCount}\n- Detected disease column: ${meta.diseaseColumn}\n- Detected symptom column: ${meta.symptomColumn}\n${meta.severityColumn ? `- Detected severity column: ${meta.severityColumn}\n` : ''}\nYou can now describe your symptoms or ask about diseases, and I will also use the Kaggle dataset for better matching.`;
    }

    if (meta.error) {
      return `⚠️ Healthcare dataset is not fully connected.\n\nError: ${meta.error}\n\nPlease make sure:\n1. The file is placed at: public/healthcare_dataset.csv\n2. It has 'disease' and 'symptom' columns (names can vary, e.g., 'Disease', 'Symptom_1').\n3. Reload the page after fixing the file.`;
    }

    return "⏳ The healthcare dataset is still loading. Please wait a moment and try again, or reload the page.";
  }

  // 1. Check for Emergency
  if (lowerText.includes('emergency') || lowerText.includes('dying') || lowerText.includes('chest pain') || lowerText.includes('breath')) {
    return "⚠ MEDICAL EMERGENCY DETECTED: Please call an ambulance (102/108) immediately or visit the nearest emergency room. I cannot treat critical conditions.";
  }

  // 2. Check for Specific Diseases
  for (const [key, data] of Object.entries(DISEASE_DATABASE)) {
    if (lowerText.includes(key) || lowerText.includes(data.name.toLowerCase())) {
      const severityEmoji = data.severity === 'serious' ? '🔴' : data.severity === 'moderate' ? '🟡' : data.severity === 'chronic' ? '🟠' : '🟢';
      return `**${data.name} Info** ${severityEmoji}\n\n**Symptoms:** ${data.symptoms.join(', ')}\n\n**Prevention:** ${data.prevention}\n\n**Treatment:** ${data.treatment}\n\n**Severity:** ${data.severity.charAt(0).toUpperCase() + data.severity.slice(1)}\n\n⚠️ Always consult a healthcare professional for proper diagnosis and treatment.`;
    }
  }

  // 3. Symptom Checker (Reverse Lookup) - Improved matching
  let diseaseScores = {};
  
  // 3a. Use built-in knowledge base
  for (const [, data] of Object.entries(DISEASE_DATABASE)) {
    let matchCount = 0;
    // Check for exact symptom matches
    for (const symptom of data.symptoms) {
      if (lowerText.includes(symptom.toLowerCase())) {
        matchCount++;
      }
    }
    
    if (matchCount > 0) {
      diseaseScores[data.name.toLowerCase()] = {
        name: data.name,
        matches: matchCount,
        totalSymptoms: data.symptoms.length,
        severity: data.severity,
        source: 'built-in',
      };
    }
  }

  // 3b. Use Kaggle healthcare_dataset.csv if available (with error handling)
  try {
    const healthcareIndex = getHealthcareIndex();
    if (healthcareIndex && healthcareIndex.diseases) {
      for (const [diseaseKey, entry] of healthcareIndex.diseases.entries()) {
        let matchCount = 0;

        // Improved symptom matching - check if any symptom phrase appears in user text
        for (const symptomText of entry.symptoms) {
          if (symptomText && symptomText.length > 0) {
            // Check for exact phrase match or word-by-word match
            const symptomWords = symptomText.split(/\s+/);
            const allWordsMatch = symptomWords.every(word => 
              word.length > 2 && lowerText.includes(word)
            );
            
            if (lowerText.includes(symptomText) || allWordsMatch) {
              matchCount++;
            }
          }
        }

        if (matchCount > 0) {
          const existing = diseaseScores[diseaseKey];
          const totalSymptoms = entry.symptoms.size;

          if (existing) {
            // Combine scores from built-in and CSV data
            existing.matches += matchCount;
            existing.totalSymptoms += totalSymptoms;
            existing.source = 'built-in + dataset';
          } else {
            // Infer severity roughly from any severity strings present, otherwise moderate
            let severity = 'moderate';
            if (entry.severities && entry.severities.size > 0) {
              const sevText = Array.from(entry.severities).join(' ');
              const s = sevText.toLowerCase();
              if (s.includes('high') || s.includes('severe') || s.includes('critical') || s.includes('urgent')) {
                severity = 'serious';
              } else if (s.includes('low') || s.includes('mild') || s.includes('minor')) {
                severity = 'mild';
              } else if (s.includes('chronic') || s.includes('long-term')) {
                severity = 'chronic';
              }
            }

            diseaseScores[diseaseKey] = {
              name: entry.name,
              matches: matchCount,
              totalSymptoms,
              severity,
              source: 'dataset',
            };
          }
        }
      }
    }
  } catch (err) {
    // Silently handle any errors from CSV dataset - app continues with built-in database
    // eslint-disable-next-line no-console
    console.warn("[HealthGuard] Error using CSV dataset:", err);
  }

  // Sort by match count and percentage
  const sortedDiseases = Object.values(diseaseScores)
    .sort((a, b) => {
      const aScore = a.matches / a.totalSymptoms;
      const bScore = b.matches / b.totalSymptoms;
      return bScore - aScore;
    })
    .slice(0, 3); // Top 3 matches

  if (sortedDiseases.length > 0) {
    const diseaseList = sortedDiseases.map(d => {
      const severityEmoji = d.severity === 'serious' ? '🔴' : d.severity === 'moderate' ? '🟡' : d.severity === 'chronic' ? '🟠' : '🟢';
      return `${severityEmoji} **${d.name}** (${d.matches} symptom${d.matches > 1 ? 's' : ''} match)`;
    }).join('\n');
    
    return `**Possible Conditions Based on Your Symptoms:**\n\n${diseaseList}\n\n⚠️ **Important:** This is not a diagnosis. Please consult a healthcare professional for proper evaluation.\n\nWould you like to:\n• See nearby hospitals?\n• Get more information about any of these conditions?\n• Receive health tips?`;
  }

  // 4. Hospital/Location Request
  if (lowerText.includes('hospital') || lowerText.includes('clinic') || lowerText.includes('doctor') || lowerText.includes('near me') || lowerText.includes('facility')) {
    const hospitalList = HOSPITALS.map(h => `🏥 **${h.name}**\n   📍 ${h.distance} | ${h.type}\n   📞 ${h.phone}`).join('\n\n');
    return `**Nearby Healthcare Facilities:**\n\n${hospitalList}\n\n💡 Tip: Call ahead to check availability and book appointments.`;
  }

  // 5. Health Tips Request
  if (lowerText.includes('health tip') || lowerText.includes('tip') || lowerText.includes('advice') || lowerText.includes('wellness')) {
    const randomTip = HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)];
    return `💡 **Health Tip:**\n\n${randomTip}\n\nWould you like another tip? Just ask!`;
  }

  // 6. Medication Information
  for (const [key, med] of Object.entries(MEDICATIONS)) {
    if (lowerText.includes(key) || lowerText.includes(med.name.toLowerCase())) {
      return `💊 **${med.name}**\n\n**Uses:** ${med.uses}\n\n**Dosage:** ${med.dosage}\n\n**⚠️ Warnings:** ${med.warnings}\n\n🔴 **Important:** Always consult a doctor before taking any medication. This is informational only.`;
    }
  }

  // 7. Medication general query
  if (lowerText.includes('medication') || lowerText.includes('medicine') || lowerText.includes('drug') || lowerText.includes('pill')) {
    const medList = Object.values(MEDICATIONS).map(m => `- ${m.name} (${m.uses})`).join('\n');
    return `**Common Medications Information:**\n\n${medList}\n\n💡 Ask about a specific medication for detailed information.\n\n⚠️ Always consult a healthcare professional before taking any medication.`;
  }

  // 8. Greetings/General
  if (lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('hey')) {
    return "👋 Hello! I'm HealthGuard AI. I can help you with:\n\n• Disease information and symptoms\n• Symptom checking\n• Finding nearby healthcare facilities\n• Health tips and wellness advice\n• Medication information\n\nHow can I assist you today?";
  }

  if (lowerText.includes('thank') || lowerText.includes('thanks')) {
    return "You're welcome! 😊 Stay healthy and take care. Feel free to ask if you need anything else!";
  }

  if (lowerText.includes('help') || lowerText.includes('what can you do')) {
    return "**I can help you with:**\n\n🔍 **Disease Information** - Ask about any disease (e.g., 'Tell me about diabetes')\n\n🏥 **Symptom Checking** - Describe your symptoms\n\n📍 **Find Hospitals** - Ask for nearby clinics or hospitals\n\n💡 **Health Tips** - Request wellness advice\n\n💊 **Medication Info** - Ask about common medications\n\n💬 Just ask me anything related to health!";
  }

  // 10. Database/Dataset Connection Check
  if (lowerText.includes('database') || lowerText.includes('dataset') || lowerText.includes('csv') || lowerText.includes('kaggle') || lowerText.includes('check database') || lowerText.includes('is database connected')) {
    const meta = getHealthcareMeta();
    
    if (meta.loaded) {
      return `✅ **Healthcare Dataset is Connected!**\n\n📊 **Statistics:**\n• Total Rows: ${meta.rowCount}\n• Disease Column: "${meta.diseaseColumn}"\n• Symptom Column: "${meta.symptomColumn}"${meta.severityColumn ? `\n• Severity Column: "${meta.severityColumn}"` : ''}\n\n🎯 **Status:** The Kaggle healthcare dataset is loaded and being used for symptom matching!\n\n💡 Try describing symptoms to see improved matching results.`;
    } else if (meta.error) {
      return `⚠️ **Healthcare Dataset Connection Issue**\n\n❌ **Error:** ${meta.error}\n\n📋 **Troubleshooting Steps:**\n1. Make sure the file exists at: \`public/healthcare_dataset.csv\`\n2. Check that the CSV has columns named like:\n   - Disease/Condition/Diagnosis\n   - Symptom/Symptoms\n3. Ensure the file is not empty\n4. Reload the page after fixing the file\n\n💡 The app will still work with the built-in disease database, but CSV matching won't be available.`;
    } else {
      return `⏳ **Healthcare Dataset is Loading...**\n\nPlease wait a moment and try again, or reload the page.\n\nThe dataset will be automatically loaded when available.`;
    }
  }

  // 9. Severity/Urgency Check
  if (lowerText.includes('severe') || lowerText.includes('serious') || lowerText.includes('critical') || lowerText.includes('urgent')) {
    return "🚨 **If you're experiencing severe symptoms, please:**\n\n1. Call emergency services (108/102) immediately\n2. Visit the nearest emergency room\n3. Don't wait - seek immediate medical attention\n\n⚠️ This chatbot cannot diagnose or treat medical emergencies.";
  }

  // Default Fallback
  return "I'm not sure I understood that. 🤔\n\n**I can help you with:**\n• Disease information (e.g., 'What is diabetes?')\n• Symptom checking (e.g., 'I have a fever and headache')\n• Finding hospitals (e.g., 'Find hospitals near me')\n• Health tips (e.g., 'Give me a health tip')\n• Medication info (e.g., 'Tell me about paracetamol')\n\nTry rephrasing your question or ask for help!";
};
