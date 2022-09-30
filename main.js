const Town = document.getElementById("Town"),
  formSumbit = document.getElementById("formSumbit"),
  body = document.getElementById("body"),
  tabNow = document.getElementById("tabNow"),
  tabDetalis = document.getElementById("tabDetalis"),
  tabForecast = document.getElementById("tabForecast")
window.addEventListener("unhandledrejection", function (e) {
  alert(e.promise), alert(e.reason)
})
let list = []
async function addTown(e) {
  try {
    e.preventDefault()
    let t = Town.value
    const n = `${"//api.openweathermap.org/data/2.5/weather"}?q=${t}&appid=${"f660a2fb1e4bad108d6160b7f58c555f"}&units=metric`
    let a = await fetch(n),
      o = await a.json()
    console.log(o)
    let l = o.main.temp
    ;(l = Math.round(l)), console.log(l)
    let i = o.main.feels_like
    i = Math.round(i)
    let d = o.weather[0].main
    renderNow(l, t, o.weather[0].icon),
      renderDetalis(l, t, i, d),
      formSumbit.reset()
  } catch (e) {
    alert(e)
  }
}
function renderNow(e, t, n) {
  const a = document.getElementById("temperatureNow"),
    o = document.getElementById("loveButton")
  a.textContent = ""
  let l = `//openweathermap.org/img/wn/${n}@2x.png`,
    i = document.createElement("img")
  ;(i.className = "img_cloud"), (i.src = l), a.prepend(i)
  let d = document.createElement("div")
  ;(d.className = "temperature"), (d.textContent = `${e}°`), a.prepend(d)
  let c = document.createElement("div")
  ;(c.className = "section1_text"),
    (c.id = "cityName"),
    (c.textContent = t),
    a.append(c),
    o.classList.add("after__render"),
    o.addEventListener("click", addLocation)
}
function renderDetalis(e, t, n, a) {
  const o = document.getElementById("DetalisTab"),
    l = document.getElementById("data_Wether")
  ;(o.textContent = ""), (l.textContent = "")
  let i = document.createElement("div")
  ;(i.className = "Actobe_text"), (i.textContent = t), o.prepend(i)
  let d = document.createElement("div")
  ;(d.textContent = `Temperature: ${e}°`), l.append(d)
  let c = document.createElement("div")
  ;(c.textContent = `Feels like: ${n}°`), l.append(c)
  let r = document.createElement("div")
  ;(r.textContent = `Weather: ${a}`), l.append(r)
}
function toStorage(e) {
  let t = JSON.stringify(e)
  localStorage.setItem("citiesArray", t)
}
function lastFavoriteViewed(e) {
  let t = e
  localStorage.setItem("lastCity", t)
}
function addLocation() {
  let e = document.getElementById("cityName").textContent
  if (
    -1 ==
    list.findIndex(function (t) {
      return t == e
    })
  ) {
    if (localStorage.length) {
      let e = JSON.parse(localStorage.getItem("citiesArray"))
      list = e
    }
    list.push(e), toStorage(list)
    JSON.parse(localStorage.getItem("citiesArray"))
    renderAddedLocation()
  } else alert("Уже есть такой город")
}
function renderAddedLocation() {
  const e = document.getElementById("city"),
    t = document.getElementById("cityTab2")
  ;(e.textContent = ""), (t.textContent = "")
  let n = JSON.parse(localStorage.getItem("citiesArray"))
  ;(list = n),
    n.forEach(function (n) {
      let a = document.createElement("div")
      ;(a.textContent = n), (a.onclick = showNowTab), e.append(a)
      let o = document.createElement("input")
      ;(o.value = "☒"),
        (o.type = "submit"),
        (o.classList = "button_close"),
        (o.onclick = deleteTown),
        e.append(o)
      let l = document.createElement("div")
      ;(l.textContent = n), (l.onclick = showNowTab), t.append(l)
      let i = document.createElement("input")
      ;(i.value = "☒"),
        (i.type = "submit"),
        (i.classList = "button_close"),
        (i.onclick = deleteTown),
        t.append(i)
    }),
    showlastCity()
}
function deleteTown(e) {
  let t = e.target.previousSibling.textContent
  t = t.trim()
  const n = list.findIndex(function (e) {
    return e == t
  })
  list.splice(n, 1), toStorage(list), renderAddedLocation()
}
async function showNowTab(e) {
  let t = e.target.textContent
  const n = `//api.openweathermap.org/data/2.5/weather?q=${t}&appid=f660a2fb1e4bad108d6160b7f58c555f&units=metric`
  let a = await fetch(n),
    o = await a.json(),
    l = o.main.temp
  l = Math.round(l)
  let i = o.main.feels_like
  i = Math.round(i)
  let d = o.weather[0].main
  renderNow(l, t, o.weather[0].icon),
    renderDetalis(l, t, i, d),
    lastFavoriteViewed(t),
    (e.target.classList = "showTown"),
    setTimeout(() => (e.target.className = "delete__class"), 350)
}
async function showlastCity() {
  let e = localStorage.getItem("lastCity")
  const t = `//api.openweathermap.org/data/2.5/weather?q=${e}&appid=f660a2fb1e4bad108d6160b7f58c555f&units=metric`
  let n = await fetch(t),
    a = await n.json(),
    o = a.main.temp
  o = Math.round(o)
  let l = a.main.feels_like
  l = Math.round(l)
  let i = a.weather[0].main
  renderNow(o, e, a.weather[0].icon), renderDetalis(o, e, l, i)
}
formSumbit.addEventListener("submit", addTown),
  (body.onload = renderAddedLocation())

