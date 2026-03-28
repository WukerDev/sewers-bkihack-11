import { defineStore } from "pinia";
import { ref } from "vue";

export interface Agent {
  id: string;
  name: string;
  specialization: string;
  status: "Online" | "Idle" | "Processing";
  monthlyCost: number;
  node: string;
  avatar: string;
}

export const useAgentStore = defineStore("agents", () => {
  const deployedAgents = ref<Agent[]>([
    {
      id: "A-01",
      name: "Aero-Analyst",
      specialization: "Analiza Umów",
      status: "Online",
      monthlyCost: 450,
      node: "Warsaw-Alpha",
      avatar: "mdi-robot-vacuum",
    },
    {
      id: "A-02",
      name: "Nexus-Shield",
      specialization: "Cybersecurity",
      status: "Processing",
      monthlyCost: 890,
      node: "Berlin-Beta",
      avatar: "mdi-shield-check",
    },
    {
      id: "A-03",
      name: "Flow-Master",
      specialization: "Optymalizacja Mesh",
      status: "Online",
      monthlyCost: 320,
      node: "Prague-Gamma",
      avatar: "mdi-waves",
    },
  ]);

  const agentTemplates = ref([
    { name: "Prawnik AI", spec: "Analiza Umów", cost: 600, icon: "mdi-gavel" },
    {
      name: "Kodujący Bot",
      spec: "Debugowanie Python",
      cost: 400,
      icon: "mdi-xml",
    },
    {
      name: "Social Media Pro",
      spec: "Generowanie treści",
      cost: 300,
      icon: "mdi-share-variant",
    },
    {
      name: "Analityk Finansowy",
      spec: "Prognozy rynkowe",
      cost: 750,
      icon: "mdi-chart-line",
    },
  ]);

  const hireAgent = (template: any) => {
    const newAgent: Agent = {
      id: `A-0${deployedAgents.value.length + 1}`,
      name: `${template.name} #${Math.floor(Math.random() * 90) + 10}`,
      specialization: template.spec,
      status: "Online",
      monthlyCost: template.cost,
      node: "Automatic-Mesh",
      avatar: template.icon,
    };
    deployedAgents.value.push(newAgent);
  };

  return { deployedAgents, agentTemplates, hireAgent };
});
