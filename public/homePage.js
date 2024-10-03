'use strict';

const logoutButton = new LogoutButton();
logoutButton.action = () => ApiConnector.logout(response => {
  if (response.success) {
    location.reload();
  }
});

ApiConnector.current(response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

const ratesBoard = new RatesBoard();
const getRatesBoard = () => ApiConnector.getStocks(response => {
  if (response.success) {
    ratesBoard.clearTable();
    ratesBoard.fillTable(response.data);
  }
});
getRatesBoard();
setInterval(getRatesBoard, 60000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = data => ApiConnector.addMoney(data, response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
    moneyManager.setMessage(true, 'Счёт пополнен на сумму ' + data.amount + ' ' + data.currency);
  }
  if (response.error) {
    moneyManager.setMessage(false, response.error);
  }
});

moneyManager.conversionMoneyCallback = data => ApiConnector.convertMoney(data, response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
    moneyManager.setMessage(true, 'Конвертация выполнена на сумму ' + data.fromAmount + ' ' + data.fromCurrency + ' в валюту ' + data.targetCurrency);
  }
  if (response.error) {
    moneyManager.setMessage(false, response.error);
  }
});

moneyManager.sendMoneyCallback = data => ApiConnector.transferMoney(data, response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
    moneyManager.setMessage(true, 'Переведено: ' + data.amount + ' ' + data.currency + ' пользователю №' + data.to);
  }
  if (response.error) {
    moneyManager.setMessage(false, response.error);
  }
});

const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});

favoritesWidget.addUserCallback = data => ApiConnector.addUserToFavorites(data, response => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
    favoritesWidget.setMessage(true, 'Пользователь ' + data.name + ' добавлен');
  } 
  if (response.error) {
    favoritesWidget.setMessage(false, response.error);
  }
});

favoritesWidget.removeUserCallback = data => ApiConnector.removeUserFromFavorites(data, response => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
    favoritesWidget.setMessage(true, 'Пользователь №' + data + ' удалён');
  }
  if (response.error) {
    favoritesWidget.setMessage(false, response.error);
  }
});