export function isDebugFsm() {
  return new URLSearchParams(location.search).get('debugfsm') !== null;
}
