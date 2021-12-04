function showNotification () {
  const title = 'Atendimento - CCTA'
  const icon = 'image-url'
  const body = 'Nova mensagem'
  const notification = new Notification(title, { body, icon })
  notification.onclick = () => {
    notification.close()
    window.parent.focus()
  }
}

function requestAndShowPermission () {
  Notification.requestPermission((permission) => {
    if (permission === 'granted') {
      showNotification()
    }
  })
}

export { showNotification, requestAndShowPermission }
