export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    me: '/auth/me'
  },
  resume: {
    upload: '/resumes/upload',
    parse: (resumeUploadId: string) => `/resumes/${resumeUploadId}/parse`
  },
  profile: {
    get: (profileId: string) => `/profiles/${profileId}`,
    update: (profileId: string) => `/profiles/${profileId}`,
    list: '/profiles',
    publish: (profileId: string) => `/profiles/${profileId}/publish`,
    republish: (profileId: string) => `/profiles/${profileId}/republish`,
    slug: (profileId: string) => `/profiles/${profileId}/slug`,
    skills: (profileId: string) => `/profiles/${profileId}/skills`,
    skill: (profileId: string, skillId: string) => `/profiles/${profileId}/skills/${skillId}`,
    links: (profileId: string) => `/profiles/${profileId}/links`,
    link: (profileId: string, linkId: string) => `/profiles/${profileId}/links/${linkId}`,
    projects: (profileId: string) => `/profiles/${profileId}/projects`,
    project: (profileId: string, projectId: string) => `/profiles/${profileId}/projects/${projectId}`,
    experiences: (profileId: string) => `/profiles/${profileId}/experiences`,
    experience: (profileId: string, experienceId: string) => `/profiles/${profileId}/experiences/${experienceId}`,
    education: (profileId: string) => `/profiles/${profileId}/education`,
    educationItem: (profileId: string, educationId: string) => `/profiles/${profileId}/education/${educationId}`,
    sections: (profileId: string) => `/profiles/${profileId}/sections`
  },
  templates: {
    list: '/templates',
    byId: (templateId: string) => `/templates/${templateId}`
  },
  public: {
    profileBySlug: (slug: string) => `/public/${slug}`
  },
  slug: {
    check: '/slugs/check'
  },
  health: {
    check: '/health'
  }
};
