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

func isPeriodValid(period string) bool {
	if period == "year" {
		return true
	}
	if period == "month" {
		return true
	}
	return false
}

func isDtValid(period string, dt string) bool {
	if period == "year" {
		return len(dt) == 4 // TODO: could think about more rigorous validation
	}
	if period == "month" {
		return len(dt) == 6
	}
	return false
}

func isEnvironmentValid(build string) bool {
	if build == "dev" {
		return true
	}
	if build == "prod" {
		return true
	}
	return false
}

func isAppConfigValid(appConfig string) bool {
	return len(appConfig) <= 10240
}
