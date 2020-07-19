const userList = {};
var userArray=[];

function userAuthentication(req, res, next) {		
	if (userList[req.session.id] === undefined) {				
		res.sendStatus(401);		
	} else {		
		next();
	}
}

function addUserToAuthList(req, res, next) {	
	if (userList[req.session.id] !== undefined) {
		res.status(403).send('user already exist');
	} else {		
		for (sessionid in userList) {
			const name = userList[sessionid];
			if (name === req.body) {
				res.status(403).send('user name exist');
				return;
			}
		}		
		userList[req.session.id] = req.body;
		userArray.push(req.body);
		next();
	}
}

function removeUserFromAuthList(req, res, next) {	
	if (userList[req.session.id] === undefined) {
		res.status(403).send('user does not exist');
	} else {						
		userArray=userArray.filter(value=> value!=userList[req.session.id]);
		delete userList[req.session.id];
		//var userInfo=getUserInfo(req.session.id);
		next();
	}
}

function getUserInfo(id) {	
    return {name: userList[id]};
}
function getAllUsersArray(){
	return userArray;
}

module.exports = {userAuthentication, addUserToAuthList, removeUserFromAuthList, getUserInfo, userList, getAllUsersArray}
