// Comprehensive Chat Settings Configuration
export const chatSettingsConfig = {
  categories: [
    {
      id: "helpType",
      title: "Help Type",
      type: "checkbox-group",
      options: [
        {
          id: "stepByStep",
          label: "Show full step-by-step solutions",
          value: false
        },
        {
          id: "hintsOnly",
          label: "Provide hints only",
          value: false
        },
        {
          id: "concepts",
          label: "Explain underlying concepts",
          value: false
        },
        {
          id: "verification",
          label: 'Verify final answers ("correct/incorrect")',
          value: false
        }
      ]
    },
    {
      id: "hintGranularity",
      title: "Hint granularity",
      type: "radio-group",
      options: [
        {
          id: "singleHint",
          label: "Single hint only",
          value: false
        },
        {
          id: "progressiveHints",
          label: "Progressive hints (students request next step)",
          value: true // Default selected
        },
        {
          id: "unlimitedHints",
          label: "Unlimited hints",
          value: false
        }
      ]
    },
    {
      id: "scope",
      title: "Scope",
      type: "section",
      subsections: [
        {
          id: "contentSource",
          title: "Content source",
          type: "radio-group",
          options: [
            {
              id: "restrictToClass",
              label: "Restrict to class slides, textbook, and notes",
              value: true // Default selected
            },
            {
              id: "allowExternal",
              label: "Allow external references/examples",
              value: false
            }
          ]
        },
        {
          id: "allowedAssignments",
          title: "Allowed assignments",
          type: "checkbox-group",
          options: [
            {
              id: "practiceProblems",
              label: "Practice problems",
              value: true // Default selected
            },
            {
              id: "gradedHomework",
              label: "Graded homework",
              value: false
            },
            {
              id: "exams",
              label: "Exams",
              value: false
            }
          ]
        }
      ]
    },
    {
      id: "interactionStyle",
      title: "Interaction Style",
      type: "section",
      subsections: [
        {
          id: "responseStyle",
          title: "Response style",
          type: "radio-group",
          options: [
            {
              id: "socratic",
              label: "Socratic (ask guiding questions)",
              value: true // Default selected
            },
            {
              id: "tutorStyle",
              label: "Tutor-style explanation",
              value: false
            },
            {
              id: "conciseFactual",
              label: "Concise factual answer",
              value: false
            }
          ]
        },
        {
          id: "scaffoldingLevel",
          title: "Scaffolding level",
          type: "radio-group",
          options: [
            {
              id: "checkPrerequisites",
              label: "Check prerequisite knowledge gaps",
              value: true // Default selected
            },
            {
              id: "assumePrerequisites",
              label: "Assume students know prerequisites",
              value: false
            }
          ]
        },
        {
          id: "tone",
          title: "Tone",
          type: "radio-group",
          options: [
            {
              id: "supportive",
              label: "Supportive/encouraging",
              value: true // Default selected
            },
            {
              id: "neutral",
              label: "Neutral",
              value: false
            },
            {
              id: "challenging",
              label: "Challenging",
              value: false
            }
          ]
        }
      ]
    },
    {
      id: "controlAccountability",
      title: "Control & Accountability",
      type: "section",
      subsections: [
        {
          id: "responseDelay",
          title: "Response delay",
          type: "radio-group",
          options: [
            {
              id: "immediate",
              label: "Immediate",
              value: false
            },
            {
              id: "thirtySecond",
              label: "30-second delay (encourages thinking)",
              value: true // Default selected
            }
          ]
        },
        {
          id: "usageLimits",
          title: "Usage limits",
          type: "number-inputs",
          options: [
            {
              id: "hintsPerProblem",
              label: "Hints per problem",
              value: 3,
              min: 0,
              max: 10
            },
            {
              id: "directAnswersPerWeek",
              label: "Direct answers per week",
              value: 0,
              min: 0,
              max: 20
            }
          ]
        },
        {
          id: "studentAccountability",
          title: "Student accountability",
          type: "info-list",
          items: [
            "Students must submit their own attempt before asking",
            "Teacher can review logs of all student-TA interactions"
          ]
        }
      ]
    }
  ]
};

// Helper function to get default settings values
export const getDefaultSettings = () => {
  const defaultSettings = {};
  
  const processCategory = (category) => {
    if (category.type === "section" && category.subsections) {
      category.subsections.forEach(processCategory);
    } else if (category.options) {
      if (category.type === "radio-group") {
        const selectedOption = category.options.find(opt => opt.value === true);
        if (selectedOption) {
          defaultSettings[category.id] = selectedOption.id;
        }
      } else if (category.type === "checkbox-group") {
        defaultSettings[category.id] = category.options
          .filter(opt => opt.value === true)
          .map(opt => opt.id);
      } else if (category.type === "number-inputs") {
        const numberValues = {};
        category.options.forEach(opt => {
          numberValues[opt.id] = opt.value;
        });
        defaultSettings[category.id] = numberValues;
      }
    }
  };
  
  chatSettingsConfig.categories.forEach(processCategory);
  return defaultSettings;
};

// Legacy support - keeping the old presetChatSettings for backward compatibility
export const presetChatSettings = [
  {
    name: "Strict",
    description: "Don't tell students anything other than this is not right if the answer is wrong",
    settings: getDefaultSettings() // Use default comprehensive settings
  },
  {
    name: "Default", 
    description: "Help the students who are struggling with the materials by telling them why their approach is wrong",
    settings: getDefaultSettings() // Use default comprehensive settings
  },
  {
    name: "Light",
    description: "Guide the students and give them similar examples to help them understand the material",
    settings: getDefaultSettings() // Use default comprehensive settings
  }
];