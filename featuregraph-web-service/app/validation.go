package app

func isUserIdValid(userId string) bool {
	return userId != ""
}

func isEmailValid(email string) bool {
	// TODO: check email format
	return email != ""
}

func isAppIdValid(appId string) bool {
	// TODO: here we could validate the format
	return true
}

func isAppNameValid(appName string) bool {
	return len(appName) <= 100
}
