import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {useConfigStore} from "../../core/config.ts";

export const useMainStore = defineStore('main', () => {
const config = useConfigStore();

  const openedClusterId = ref<string | null>(null)
  const selectedCompanyId = ref<string | null>(null)
  const selectedCompany = computed(() => {
    if (!selectedCompanyId.value) return null;
    for (const cluster of config.clusters) {
      const company = cluster.companies.find(c => c.id === selectedCompanyId.value)
      if (company) return { clusterName: cluster.name, ...company }
    }
    return null
  })

  function toggleCluster(clusterId: string) {
    openedClusterId.value = openedClusterId.value === clusterId ? null : clusterId
  }

  function selectCompany(companyId: string | null) {
    selectedCompanyId.value = companyId
  }

  return {
    openedClusterId,
    selectedCompanyId,
    selectedCompany,
    toggleCluster,
    selectCompany
  }
})