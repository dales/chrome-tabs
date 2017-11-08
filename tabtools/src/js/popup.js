var app = angular.module('TabTools', [])

app.controller('MasterController', function ($scope, $filter) {

	$scope.name = "Tab Tools"
	$scope.tabs = []

	chrome.tabs.query({}, function (tabs) {
		tabs.forEach(function (tab) {
			tab.muted = true && tab.mutedInfo.muted
			if (!!tab.favIconUrl && tab.favIconUrl.indexOf('blob') !== 0) {
				$scope.tabs.push(tab)
			}
			console.log(tab);
		});
		$scope.$apply()
	})

	$scope.updateFilteredResults = function () {
		$scope.fileredTabs = $filter('filter')($scope.tabs, $scope.filter)
	}

	$scope.updateFilteredResults()

	$scope.muteAll = function () {

		$scope.tabs.forEach(function (tab) {
			if (tab.audible) {
				chrome.tabs.update(tab.id, {
					muted: true
				})
			}
		})
	}

	$scope.group = function () {

		function cleanUrl(url) { return url.replace(/https?:\/\/w?w?w?\.?/i, "") }

		var sorted = $scope.tabs.sort(function (a, b) {
			return cleanUrl(a.url).localeCompare(cleanUrl(b.url))
		})
		sorted.forEach(function (tab, index) {
			chrome.tabs.move(tab.id, {
				index: index
			})
			console.log(cleanUrl(tab.url));
		})
	}

	$scope.closeAll = function () {

		$scope.fileredTabs.forEach(function (tab) {
			chrome.tabs.remove(tab.id)
			var index = $scope.tabs.indexOf(tab)
			if (index >= 0) {
				$scope.tabs.splice(index, 1)
			}
		})
		$scope.filter = ""
		$scope.updateFilteredResults()
	}
	$scope.unmuteAll = function () {

		$scope.tabs.forEach(function (tab) {
			if (tab.audible) {
				chrome.tabs.update(tab.id, {
					muted: false
				})
			}
		})
	}

	$scope.toggleSound = function (tab) {
		console.log(tab);
		tab.muted = !tab.muted
		chrome.tabs.update(tab.id, {
			muted: tab.muted
		})
		$scope.$apply()
	}

	$scope.activateTab = function (tab) {
		chrome.tabs.update(tab.id, {
			active: true
		})

	}

	$scope.closeTab = function (tab) {
		chrome.tabs.remove(tab.id, function () {
			var index = $scope.tabs.indexOf(tab)
			$scope.tabs.splice(index, 1)
			$scope.$apply()
		})
	}

	$scope.getSite = function (url) {
		var newUrl = /\w+:\/\/(.+?)\//.exec(url)[1]
		return newUrl
	}

})