export function isArtwork(path) {
  return !/^assets\/(?:icons|home-tabs)\//.test(path)
    && !/^assets\/(?:adaptive-icon|favicon|icon)\.[^.]+$/.test(path)
    && !/^assets\/brand\/(?:comment-default-icon|home_nav_chat|home_nav_game|home_nav_icon|logo-icon)\.[^.]+$/.test(path)
    && !/(?:\/AppIcon\.appiconset\/|\/ic_launcher[^/]*$)/.test(path);
}
