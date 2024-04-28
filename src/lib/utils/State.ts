// State declared here will stay on HMR reloads, but will be reset on a full page reload.

export enum mode {
  Stationary = "Stationary",
  FPS = "FPS",
  FollowShaun = "Follow Shaun",
  FollowFarmer = "Follow Farmer",
  FollowBitzer = "Follow Bitzer"
}

export const AppState = {
  cameraX: 0,
  cameraY: -35,
  cameraZ: -300,
  cameraMode: mode.FPS,
  zoom: -100,
  THETA: 0,
  PHI: 0,
};
