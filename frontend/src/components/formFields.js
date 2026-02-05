export const formFields = [
  { name: 'Age', label: 'Age', type: 'number', min: 0, max: 120, placeholder: 'Enter age' },
  { name: 'Sex', label: 'Gender', type: 'select', options: [
    { value: '0', label: 'Female' },
    { value: '1', label: 'Male' }
  ]},
  { name: 'ChestPainType', label: 'Chest Pain Type', type: 'select', options: [
    { value: '1', label: 'Typical Angina' },
    { value: '2', label: 'Atypical Angina' },
    { value: '3', label: 'Non-anginal Pain' },
    { value: '4', label: 'Asymptomatic' }
  ]},
  { name: 'BP', label: 'Blood Pressure (mm Hg)', type: 'number', min: 0, max: 300, placeholder: 'e.g., 120' },
  { name: 'Cholesterol', label: 'Cholesterol (mg/dl)', type: 'number', min: 0, max: 700, placeholder: 'e.g., 200' },
  { name: 'FBS', label: 'Fasting Blood Sugar > 120 mg/dl', type: 'select', options: [
    { value: '0', label: 'No (< 120)' },
    { value: '1', label: 'Yes (> 120)' }
  ]},
  { name: 'EKG', label: 'EKG Results', type: 'select', options: [
    { value: '0', label: 'Normal' },
    { value: '1', label: 'ST-T Abnormality' },
    { value: '2', label: 'Left Ventricular Hypertrophy' }
  ]},
  { name: 'MaxHR', label: 'Maximum Heart Rate', type: 'number', min: 0, max: 250, placeholder: 'e.g., 150' },
  { name: 'ExerciseAngina', label: 'Exercise Induced Angina', type: 'select', options: [
    { value: '0', label: 'No' },
    { value: '1', label: 'Yes' }
  ]},
  { name: 'STDepression', label: 'ST Depression', type: 'number', step: '0.1', min: 0, max: 10, placeholder: 'e.g., 0.0' },
  { name: 'SlopeST', label: 'Slope of ST Segment', type: 'select', options: [
    { value: '1', label: 'Upsloping' },
    { value: '2', label: 'Flat' },
    { value: '3', label: 'Downsloping' }
  ]},
  { name: 'NumVessels', label: 'Number of Major Vessels', type: 'select', options: [
    { value: '0', label: '0' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' }
  ]},
  { name: 'Thallium', label: 'Thallium Scan', type: 'select', options: [
    { value: '3', label: 'Normal' },
    { value: '6', label: 'Fixed Defect' },
    { value: '7', label: 'Reversible Defect' }
  ]}
];