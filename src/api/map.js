export function TMap () {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(qq)
    }
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'http://map.qq.com/api/js?v=2.exp&callback=init&key=S5UBZ-27AK2-Z7CUQ-CYBMM-AL7WZ-GZFIB'
    script.onerror = reject
    document.head.appendChild(script)
  })
}
