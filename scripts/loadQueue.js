// A simple priority/throttling mechanism for frame loads.
var loadQueue = [];
var loading = 0;
// TODO: Does staggering loads defeat the purpose of the queueThrottle?
function shiftLoadQueue() {
  // TODO: Use item priority
  return loadQueue.shift();
}
function cancelLoadIfPending(id) {
  // TODO: implement
}
function pushLoadQueue(id, priority, fn) {
  loadQueue.push({ id: id, priority: priority, fn: fn });
  // If a bunch of pushes are triggered at the same time, we want to wait a bit
  // before pumping in case a higher priority load is about to be pushed.
  setTimeout(pumpLoadQueue, 20);
}
function pumpLoadQueue() {
  if (loadQueue.length == 0) return;
  chrome.storage.sync.get(['loadLimit', 'queueThrottle'], function(items) {
    if (loading < items['loadLimit'] && loadQueue.length > 0) {
      loading++;
      shiftLoadQueue().fn(function() {
        loading--;
        // Throttle the load queue a bit.
        setTimeout(pumpLoadQueue, items['queueThrottle']);
      });
    }
  });
}
