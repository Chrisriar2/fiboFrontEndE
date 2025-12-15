import { httpClient } from './httpClient';

export interface GenerationRequest {
  prompt: string;
  negative_prompt?: string;
  raw_camera?: {
    position: [number, number, number];
    rotation: [number, number, number];
    fov: number;
  };
  raw_light?: {
    position?: [number, number, number];
    intensity?: number;
  };
  project_id?: string;
}

export interface GenerationResponse {
  id: string;
  user_id: string;
  project_id?: string;
  prompt: string;
  negative_prompt?: string;
  image_url?: string;
  video_url?: string;
  status: 'generating' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface ProjectRequest {
  name: string;
  description?: string;
  status?: 'draft' | 'completed' | 'archived';
  scene_data?: any;
}

export interface ProjectResponse {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: string;
  scene_data?: any;
  created_at: string;
  updated_at: string;
  generations?: GenerationResponse[];
}

export const generationApi = {
  // Generate a frame/image
  async generateSingleFrame(data: GenerationRequest, token?: string): Promise<GenerationResponse> {
    return httpClient.post('/generation/single', data, token);
  },

  // Get generation history
  async getGenerations(token?: string): Promise<GenerationResponse[]> {
    return httpClient.get('/generation', token);
  },

  // Get a specific generation
  async getGeneration(id: string, token?: string): Promise<GenerationResponse> {
    return httpClient.get(`/generation/${id}`, token);
  },

  // FIBO health check
  async healthCheck(): Promise<{ status: string }> {
    return httpClient.get('/generation/health');
  },

  // Get lighting presets
  async getLightingPresets(token?: string): Promise<any[]> {
    const all = await generationApi.getAllPresets(token);
    return all.lighting || [];
  },

  // Get camera presets
  async getCameraPresets(token?: string): Promise<any[]> {
    const all = await generationApi.getAllPresets(token);
    return all.camera || [];
  },

  // Get all presets grouped by type
  async getAllPresets(token?: string): Promise<{ lighting: any[]; camera: any[]; directors?: any[] }> {
    const res = await httpClient.get('/presets/list', token);
    // Some backends return an array of presets with `type`.
    if (!res) return { lighting: [], camera: [], directors: [] };

    if (Array.isArray(res)) {
      const lighting = res.filter((p: any) => p.type === 'lighting');
      const camera = res.filter((p: any) => p.type === 'camera');
      return { lighting, camera, directors: [] };
    }

    // If the backend returns { lighting: [...], camera: [...] }
    if (res.lighting || res.camera) {
      return {
        lighting: res.lighting || [],
        camera: res.camera || [],
        directors: []
      };
    }

    // If the backend returns a presets map (e.g., DIRECTOR_PRESETS)
    // Convert to an array of director presets: { id, name, camera, lighting, style }
    if (typeof res === 'object') {
      const directors = Object.keys(res).map((k) => ({ id: k, ...(res as any)[k] }));
      return { lighting: [], camera: [], directors };
    }

    return { lighting: [], camera: [], directors: [] };
  },
};

export const projectApi = {
  // Get user's projects
  async getProjects(token?: string, page = 1, perPage = 10): Promise<{
    success: boolean;
    projects: ProjectResponse[];
    total: number;
    pages: number;
  }> {
    return httpClient.get(`/projects?page=${page}&per_page=${perPage}`, token);
  },

  // Get a specific project
  async getProject(id: string, token?: string): Promise<ProjectResponse> {
    return httpClient.get(`/projects/${id}`, token);
  },

  // Create new project
  async createProject(data: ProjectRequest, token?: string): Promise<ProjectResponse> {
    return httpClient.post('/projects', data, token);
  },

  // Update project
  async updateProject(id: string, data: Partial<ProjectRequest>, token?: string): Promise<ProjectResponse> {
    return httpClient.put(`/projects/${id}`, data, token);
  },

  // Delete project
  async deleteProject(id: string, token?: string): Promise<{ success: boolean }> {
    return httpClient.delete(`/projects/${id}`, token);
  },

  // Save scene to project
  async saveScene(projectId: string, sceneData: any, token?: string): Promise<any> {
    return httpClient.put(`/projects/${projectId}`, { scene_data: sceneData }, token);
  },
};
