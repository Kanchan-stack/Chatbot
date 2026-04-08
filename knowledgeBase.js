export const DISEASE_DATABASE = {
  malaria: {
    name: "Malaria",
    symptoms: ["fever", "chills", "headache", "nausea", "sweating", "body aches"],
    prevention: "Use mosquito nets, insect repellent, and remove stagnant water.",
    treatment: "Antimalarial medication prescribed by a doctor.",
    severity: "moderate"
  },
  dengue: {
    name: "Dengue",
    symptoms: ["high fever", "rash", "joint pain", "eye pain", "vomiting", "bleeding"],
    prevention: "Wear long sleeves, eliminate standing water breeding sites.",
    treatment: "Hydration and pain management. Avoid aspirin.",
    severity: "moderate"
  },
  covid: {
    name: "COVID-19",
    symptoms: ["cough", "fever", "loss of taste", "fatigue", "shortness of breath", "sore throat"],
    prevention: "Masking, vaccination, hand washing, social distancing.",
    treatment: "Rest, hydration, and antivirals for high-risk groups.",
    severity: "moderate"
  },
  typhoid: {
    name: "Typhoid",
    symptoms: ["weakness", "stomach pain", "headache", "rash", "dry cough", "constipation"],
    prevention: "Drink clean water, eat cooked food, sanitation.",
    treatment: "Antibiotics prescribed by a healthcare provider.",
    severity: "moderate"
  },
  flu: {
    name: "Seasonal Flu",
    symptoms: ["fever", "muscle aches", "chills", "congestion", "sore throat", "fatigue"],
    prevention: "Annual flu shot, hand hygiene.",
    treatment: "Rest, fluids, antiviral drugs if caught early.",
    severity: "mild"
  },
  diabetes: {
    name: "Diabetes",
    symptoms: ["excessive thirst", "frequent urination", "fatigue", "blurred vision", "slow healing", "weight loss"],
    prevention: "Maintain healthy weight, regular exercise, balanced diet, avoid sugary foods.",
    treatment: "Blood sugar monitoring, medication (insulin or oral), diet management.",
    severity: "chronic"
  },
  hypertension: {
    name: "Hypertension (High Blood Pressure)",
    symptoms: ["headache", "dizziness", "chest pain", "shortness of breath", "nosebleeds"],
    prevention: "Reduce salt intake, exercise regularly, maintain healthy weight, limit alcohol.",
    treatment: "Lifestyle changes, blood pressure medications, regular monitoring.",
    severity: "chronic"
  },
  asthma: {
    name: "Asthma",
    symptoms: ["wheezing", "shortness of breath", "chest tightness", "coughing", "difficulty breathing"],
    prevention: "Avoid triggers (dust, pollen, smoke), use inhalers as prescribed, regular check-ups.",
    treatment: "Inhalers (rescue and controller), avoiding triggers, medication.",
    severity: "chronic"
  },
  pneumonia: {
    name: "Pneumonia",
    symptoms: ["cough", "fever", "chest pain", "shortness of breath", "fatigue", "sweating"],
    prevention: "Vaccination, hand hygiene, avoid smoking, strengthen immune system.",
    treatment: "Antibiotics, rest, fluids, oxygen therapy if severe.",
    severity: "moderate"
  },
  tuberculosis: {
    name: "Tuberculosis (TB)",
    symptoms: ["persistent cough", "chest pain", "coughing blood", "fatigue", "weight loss", "night sweats"],
    prevention: "BCG vaccination, avoid close contact with infected persons, good ventilation.",
    treatment: "Long-term antibiotic treatment (6-9 months), directly observed therapy.",
    severity: "serious"
  },
  hepatitis: {
    name: "Hepatitis",
    symptoms: ["jaundice", "fatigue", "nausea", "abdominal pain", "dark urine", "loss of appetite"],
    prevention: "Vaccination (Hep A & B), safe food and water, avoid sharing needles, safe sex.",
    treatment: "Rest, hydration, antiviral medications, liver function monitoring.",
    severity: "moderate"
  },
  cholera: {
    name: "Cholera",
    symptoms: ["severe diarrhea", "vomiting", "dehydration", "rapid heart rate", "low blood pressure"],
    prevention: "Safe drinking water, proper sanitation, hand washing, vaccination.",
    treatment: "Oral rehydration solution, IV fluids, antibiotics in severe cases.",
    severity: "serious"
  },
  jaundice: {
    name: "Jaundice",
    symptoms: ["yellow skin", "yellow eyes", "dark urine", "pale stools", "fatigue", "abdominal pain"],
    prevention: "Vaccination for hepatitis, avoid alcohol abuse, safe food handling.",
    treatment: "Depends on cause - may include medication, dietary changes, or surgery.",
    severity: "moderate"
  },
  diarrhea: {
    name: "Diarrhea",
    symptoms: ["loose stools", "frequent bowel movements", "abdominal cramps", "dehydration", "nausea"],
    prevention: "Hand washing, safe food and water, proper food storage, vaccination (rotavirus).",
    treatment: "Oral rehydration solution, rest, avoid dairy and fatty foods, antibiotics if bacterial.",
    severity: "mild"
  },
  anemia: {
    name: "Anemia",
    symptoms: ["fatigue", "weakness", "pale skin", "shortness of breath", "dizziness", "cold hands"],
    prevention: "Iron-rich diet (leafy greens, meat), vitamin B12 and folate, regular check-ups.",
    treatment: "Iron supplements, dietary changes, treat underlying cause, blood transfusion if severe.",
    severity: "moderate"
  },
  arthritis: {
    name: "Arthritis",
    symptoms: ["joint pain", "stiffness", "swelling", "reduced range of motion", "redness around joints"],
    prevention: "Maintain healthy weight, regular exercise, protect joints, balanced diet.",
    treatment: "Pain relievers, anti-inflammatory drugs, physical therapy, lifestyle modifications.",
    severity: "chronic"
  },
  migraine: {
    name: "Migraine",
    symptoms: ["severe headache", "nausea", "sensitivity to light", "sensitivity to sound", "vomiting", "aura"],
    prevention: "Identify triggers, regular sleep, stress management, avoid certain foods.",
    treatment: "Pain relievers, triptans, preventive medications, lifestyle changes.",
    severity: "moderate"
  },
  bronchitis: {
    name: "Bronchitis",
    symptoms: ["cough", "mucus production", "fatigue", "chest discomfort", "shortness of breath", "fever"],
    prevention: "Avoid smoking, hand hygiene, avoid irritants, flu vaccination.",
    treatment: "Rest, fluids, cough medicine, bronchodilators, antibiotics if bacterial.",
    severity: "mild"
  },
  sinusitis: {
    name: "Sinusitis",
    symptoms: ["facial pain", "nasal congestion", "thick nasal discharge", "headache", "cough", "fever"],
    prevention: "Avoid allergens, hand hygiene, use humidifier, avoid smoking.",
    treatment: "Nasal decongestants, saline irrigation, antibiotics if bacterial, pain relievers.",
    severity: "mild"
  },
  urinary: {
    name: "Urinary Tract Infection (UTI)",
    symptoms: ["burning urination", "frequent urination", "cloudy urine", "pelvic pain", "fever"],
    prevention: "Drink plenty of water, urinate after sex, wipe front to back, avoid irritants.",
    treatment: "Antibiotics, increased fluid intake, pain relievers, cranberry products may help.",
    severity: "mild"
  },
  chickenpox: {
    name: "Chickenpox",
    symptoms: ["rash", "fever", "itchy blisters", "fatigue", "headache", "loss of appetite"],
    prevention: "Vaccination, avoid contact with infected persons, good hygiene.",
    treatment: "Symptomatic relief, calamine lotion, antihistamines, antiviral in high-risk cases.",
    severity: "mild"
  },
  measles: {
    name: "Measles",
    symptoms: ["high fever", "rash", "cough", "runny nose", "red eyes", "white spots in mouth"],
    prevention: "MMR vaccination, avoid contact with infected persons.",
    treatment: "Supportive care, rest, fluids, vitamin A supplementation, isolation.",
    severity: "moderate"
  }
};

export const HEALTH_TIPS = [
  "Drink at least 8 glasses of water daily to stay hydrated.",
  "Get 7-9 hours of sleep each night for optimal health.",
  "Exercise for at least 30 minutes daily to boost immunity.",
  "Wash your hands frequently with soap and water.",
  "Eat a balanced diet with fruits, vegetables, and whole grains.",
  "Avoid smoking and limit alcohol consumption.",
  "Get regular health check-ups and screenings.",
  "Practice stress management through meditation or yoga.",
  "Maintain a healthy weight through diet and exercise.",
  "Protect yourself from sun exposure with sunscreen.",
  "Practice good oral hygiene - brush twice daily.",
  "Stay up-to-date with vaccinations.",
  "Limit processed foods and added sugars.",
  "Take breaks from screens to protect your eyes.",
  "Practice safe food handling and cooking."
];

export const MEDICATIONS = {
  "paracetamol": {
    name: "Paracetamol (Acetaminophen)",
    uses: "Fever, pain relief",
    dosage: "500-1000mg every 4-6 hours (max 4g/day)",
    warnings: "Do not exceed recommended dose, avoid with alcohol"
  },
  "ibuprofen": {
    name: "Ibuprofen",
    uses: "Pain, inflammation, fever",
    dosage: "200-400mg every 4-6 hours",
    warnings: "Take with food, avoid if stomach ulcers, not for children under 6 months"
  },
  "aspirin": {
    name: "Aspirin",
    uses: "Pain, fever, blood thinning",
    dosage: "325-650mg every 4 hours",
    warnings: "Avoid in children (Reye's syndrome), not for dengue, consult doctor"
  },
  "antacid": {
    name: "Antacid",
    uses: "Heartburn, indigestion, acid reflux",
    dosage: "As directed on package",
    warnings: "Take 1 hour after meals, avoid with other medications"
  }
};

export const HOSPITALS = [
  { name: "City General Hospital", distance: "2.5 km", type: "Public", phone: "1800-123-456" },
  { name: "Community Health Center", distance: "5.0 km", type: "Rural Clinic", phone: "1800-789-012" },
  { name: "Sunrise Private Clinic", distance: "1.2 km", type: "Private", phone: "1800-345-678" },
  { name: "Regional Medical Center", distance: "3.8 km", type: "Public", phone: "1800-456-789" },
  { name: "Wellness Hospital", distance: "4.2 km", type: "Private", phone: "1800-234-567" },
  { name: "Emergency Care Unit", distance: "1.5 km", type: "Emergency", phone: "108" },
];
