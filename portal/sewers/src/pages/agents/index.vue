<template>
  <v-container class="py-8 relative-top" style="max-width: 1200px">
    <div class="d-flex align-center mb-8">
      <div>
        <h1 class="text-h4 font-weight-black aero-text-gradient">Agenci AI</h1>
      </div>
      <v-spacer></v-spacer>
      <v-btn
        class="aero-btn-hire px-8"
        prepend-icon="mdi-plus-circle"
        height="50"
        rounded="xl"
        @click="drawer = true"
      >
        Zatrudnij Nowego
      </v-btn>
    </div>

    <v-row>
      <v-col
        v-for="agent in store.deployedAgents"
        :key="agent.id"
        cols="12"
        md="4"
      >
        <v-card class="frutiger-agent-card h-100">
          <div class="gloss-overlay"></div>
          <div class="pa-5 relative-content">
            <div class="d-flex justify-space-between mb-4">
              <div class="avatar-capsule">
                <v-icon size="35" color="primary">{{ agent.avatar }}</v-icon>
              </div>

              <v-chip
                :color="agent.status === 'Online' ? 'success' : 'warning'"
                size="x-large"
                class="status-chip font-weight-black"
                >{{ agent.status }}</v-chip
              >
            </div>
            <div class="agent-name">{{ agent.name }}</div>
            <div class="agent-spec mb-4">{{ agent.specialization }}</div>
            <div
              class="d-flex justify-space-between text-caption font-weight-bold"
            >
              <span class="text-secondary">Miesięcznie:</span>
              <span class="text-primary">{{ agent.monthlyCost }} PLN</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-navigation-drawer
      v-model="drawer"
      location="right"
      temporary
      width="400"
      class="aero-drawer"
    >
      <div class="pa-6 relative-content">
        <h2 class="text-h5 font-weight-black text-secondary mb-6">
          Katalog Agentów
        </h2>

        <v-card
          v-for="temp in store.agentTemplates"
          :key="temp.name"
          class="template-card mb-4 pa-4 d-flex align-center"
          @click="confirmHire(temp)"
        >
          <v-icon size="32" color="primary" class="mr-4">{{
            temp.icon
          }}</v-icon>
          <div>
            <div class="font-weight-black text-secondary">{{ temp.name }}</div>
            <div class="text-caption">{{ temp.spec }}</div>
          </div>
          <v-spacer></v-spacer>
          <div class="text-right">
            <div class="text-primary font-weight-black">{{ temp.cost }}zł</div>
            <v-icon size="small" color="success">mdi-plus</v-icon>
          </div>
        </v-card>
      </div>
    </v-navigation-drawer>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAgentStore } from "./store";

const store = useAgentStore();
const drawer = ref(false);

const confirmHire = (template: any) => {
  store.hireAgent(template);
  drawer.value = false; // Zamknij po wyborze
};
</script>

<style scoped>
/* TYPOGRAFIA FRUTIGER */
.aero-text-gradient {
  background: linear-gradient(to bottom, #034d77, #0284c7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem !important;
}

.agent-name {
  font-size: 1.4rem;
  font-weight: 900;
  color: #034d77;
  line-height: 1.2;
}

.agent-spec {
  font-size: 0.8rem;
  font-weight: 700;
  color: #0ea5e9;
  text-transform: uppercase;
}

.frutiger-agent-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.85) 0%,
    rgba(224, 242, 254, 0.5) 100%
  ) !important;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 1) !important;
  border-radius: 30px !important;
  box-shadow: 0 20px 40px rgba(0, 120, 212, 0.1) !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

.frutiger-agent-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 30px 60px rgba(0, 120, 212, 0.25) !important;
}

.avatar-capsule {
  background: radial-gradient(circle at 30% 30%, #ffffff, #bae6fd);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  box-shadow:
    0 5px 15px rgba(0, 0, 0, 0.05),
    inset 0 0 10px white;
}

/* PRZYCISK ZATRUDNIJ */
.aero-btn-hire {
  background: linear-gradient(
    to bottom,
    #4ade80 0%,
    #16a34a 50%,
    #15803d 100%
  ) !important;
  color: white !important;
  font-weight: 900;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 15px rgba(22, 163, 74, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

/* ELEMENTY ESTETYCZNE */
.gloss-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.6) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  z-index: 1;
}

.status-chip {
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.opacity-20 {
  opacity: 0.2;
}
.aero-drawer {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(25px) saturate(150%);
  border-left: 1px solid white !important;
}

.template-card {
  background: rgba(255, 255, 255, 0.5) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  border-radius: 15px !important;
  transition: all 0.2s;
  cursor: pointer;
}

.template-card:hover {
  background: rgba(2, 132, 199, 0.1) !important;
  transform: translateX(-5px);
  border-color: #0284c7 !important;
}

/* Stil dla nagłówka w store */
.aero-text-gradient {
  background: linear-gradient(to bottom, #034d77, #0284c7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
