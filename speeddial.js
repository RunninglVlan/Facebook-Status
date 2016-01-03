var Constants = {
	STATE_DONE: 4,
	STATUS_OK:  200,
	TIME_5S:    1000 * 5,
	TIME_10S:   1000 * 10,
	TIME_30S:   1000 * 30
};

function fetchPage() {
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if (this.readyState === Constants.STATE_DONE && this.status === Constants.STATUS_OK) {
			parseHtml(xhr.responseText);
		}
	};
	xhr.timeout = Constants.TIME_5S;
	xhr.open("GET", "https://www.facebook.com/");
	xhr.send(null);
}

function Status(id) {
	var CLASS_COUNT = "count";
	var LEFT_COUNT = "-35px";
	var element = document.getElementById(id);
	var countElement = element.getElementsByClassName(CLASS_COUNT)[0];

	this.update = function (newCount) {
		this.updateCount(newCount);
		if (newCount > 0) {
			element.style.left = LEFT_COUNT;
		} else {
			element.style.left = 0;
		}
	}
	this.updateCount = function (newCount) {
		countElement.innerText = newCount;
	}
}

function Post(friendSrc, friendName, imageSrc, pContent) {
	var divPost = document.createElement("div");
	divPost.className = "post";
	var divFriend = document.createElement("div");
	divFriend.className = "friend";
	var img = new Image(20, 20);
	img.src = friendSrc;
	divFriend.appendChild(img);
	var divName = document.createElement("div");
	var spanName = document.createElement("span");
	var name = document.createTextNode(friendName);
	spanName.appendChild(name);
	divName.appendChild(spanName);
	divFriend.appendChild(divName);
	divPost.appendChild(divFriend);

	if (imageSrc != null) {
		divPost.style.backgroundImage = "url(" + imageSrc + ')';
	}
	if (pContent != null) {
		var p = document.createElement('p');
		p.innerHTML = pContent;
		divPost.appendChild(p);
	}

	this.getElement = function () {
		return divPost;
	}
}

var requests = new Status("requests");
var messages = new Status("messages");
var notifications = new Status("notifications");

function Posts() {
	var MAX_CHILDREN = 10;
	var element = document.getElementsByClassName("posts content")[0];
	var currentPost = 0;

	this.add = function (post) {
		if (element.children.length === MAX_CHILDREN) {
			element.removeChild(element.firstChild);
		}
		element.appendChild(post);
	}
	this.next = function () {
		if (currentPost < element.children.length-1) {
			currentPost++;
		} else {
			currentPost = 0;
		}
		element.style.top = (currentPost * -100) + '%';
	}
}

var posts = new Posts();

function parseHtml(response) {
	if (response.length === 0) {
		return;
	}

	var doc = new DOMParser().parseFromString(response, "text/html");
	requests.update(doc.getElementById("requestsCountValue").innerText);
	messages.update(doc.getElementById("mercurymessagesCountValue").innerText);
	notifications.update(doc.getElementById("notificationsCountValue").innerText);

	// Testing
	var post1 = new Post("https://scontent-waw1-1.xx.fbcdn.net/hprofile-frc3/v/t1.0-1/c0.0.50.50/p50x50/10403451_277060612474154_4564281143501543881_n.jpg?oh=39588c9f9d565cea33cd6693d36e080a&oe=56FD7C57", "Escape room www.escaperoom.lv", "https://scontent-waw1-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-0/s480x480/993874_482657175247829_6605694496927325406_n.jpg?oh=929458f11c61d17ae3b0dbcabbdb0597&oe=57470411", null);
	posts.add(post1.getElement());
	var post2 = new Post("https://scontent-waw1-1.xx.fbcdn.net/hprofile-xfl1/v/t1.0-1/c39.39.488.488/s50x50/407588_360670770614946_1310727082_n.jpg?oh=e8c0ee72348f8656a37f56f7ab470bd2&oe=56FF8BA3", "Андрей Бочаров", null, "Давайте от нечего делать про сны что-ли. Мне такой был. Прихожу в магазин, набираю всего много - сыр, ветчину, апельсины, вино, морковку, стиральный порошок. Подхожу к кассе. Мне кассирша всё пробивает, я ей деньги протягиваю, а она говорит - \"А у вас деньги прошлогодние, мы такие уже не принимаем\". Проснулся, как водится, в холодном поту и бегом в магазин, проверять. Вроде пока принимают. А вам что снится?<br> П.С. Шапку пока не выбрал, голосование продолжается.");
	posts.add(post2.getElement());
}

window.addEventListener("load", function () {
	fetchPage();
	window.setInterval(function () {
	  fetchPage();
	}, Constants.TIME_30S);
	window.setInterval(function () {
	  posts.next();
	}, Constants.TIME_10S);
}, false);
