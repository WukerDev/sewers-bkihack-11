import { defineStore } from "pinia";
import { ref } from "vue";
import {useConfigStore} from "../../core/config.ts";

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
    const config = useConfigStore();
  const hireAgent = (template: any) => {
    const newAgent: Agent = {
      id: `A-0${config.deployedAgents.length + 1}`,
      name: `${template.name} #${Math.floor(Math.random() * 90) + 10}`,
      specialization: template.spec,
      status: "Online",
      monthlyCost: template.cost,
      node: "Automatic-Mesh",
      avatar: template.icon,
    };
    config.deployedAgents.push(newAgent);
  };

  return {  hireAgent };
});
