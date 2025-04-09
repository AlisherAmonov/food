function tabs(
  tabsSelector,
  tabsContentSelector,
  tabsParentSelector,
  acviveClass
) {
  const tabs = document.querySelectorAll(tabsSelector)
  const tabsContent = document.querySelectorAll(tabsContentSelector)
  const tabsParent = document.querySelector(tabsParentSelector)

  function hideTabContent() {
    tabsContent.forEach((item) => {
      item.classList.remove('show', 'fade')
      item.classList.add('hide')
    })

    tabs.forEach((item) => {
      item.classList.remove(acviveClass)
    })
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add('show', 'fade')
    tabsContent[i].classList.remove('hide')
    tabs[i].classList.add(acviveClass)
  }

  hideTabContent()
  showTabContent()

  tabsParent.addEventListener('click', (e) => {
    const target = e.target

    if (target && target.classList.contains(tabsSelector.slice(1))) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent()
          showTabContent(i)
        }
      })
    }
  })
}

export default tabs
