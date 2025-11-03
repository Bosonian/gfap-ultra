import { t } from "../../localization/i18n";

export function renderProgressIndicator(currentStep) {
  const steps = [
    { id: 1, label: "triage" },
    { id: 2, label: "assessment" },
    { id: 3, label: "resultsProgress" },
  ];

  let html = `
    <div class="flex items-center justify-between mb-6 relative">
  `;

  steps.forEach((step, index) => {
    const isActive = step.id === currentStep;
    const isCompleted = step.id < currentStep;

    html += `
      <div class="flex-1 flex flex-col items-center text-center relative">
        <!-- Step Circle -->
        <div class="w-8 h-8 flex items-center justify-center rounded-full 
                    ${isCompleted ? "bg-green-500 text-white" : isActive ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"} 
                    font-bold z-10">
          ${isCompleted ? "✓" : step.id}
        </div>

        <!-- Step Label -->
        <span class="mt-2 text-xs ${isActive ? "text-blue-500" : "text-gray-500"}">
          ${t(step.label) || step.label}
        </span>

        <!-- Connector Line (except last step) -->
        ${
          index < steps.length - 1
            ? `<div class="absolute top-4 left-1/2 w-full h-1 ${isCompleted ? "bg-green-500" : "bg-gray-300"} z-0"></div>`
            : ""
        }
      </div>
    `;
  });

  html += "</div>";
  return html;
}
