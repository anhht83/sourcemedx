#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Base URL
BASE_URL="http://localhost:3000"

# Function to login and get token
login() {
    local username=$1
    local password=$2
    echo "Logging in as $username..."
    response=$(curl -s -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$username\",\"password\":\"$password\"}")
    echo $response | grep -q "access_token"
    if [ $? -eq 0 ]; then
        token=$(echo $response | sed 's/.*"access_token":"\([^"]*\)".*/\1/')
        echo -e "${GREEN}Login successful${NC}"
        echo $token
    else
        echo -e "${RED}Login failed${NC}"
        echo "$response"
        echo ""
    fi
}

# Function to make API call
make_request() {
    local method=$1
    local endpoint=$2
    local token=$3
    local data=$4

    echo -e "\nTesting $method $endpoint"
    if [ -z "$data" ]; then
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $token" \
            -w "\nStatus: %{http_code}")
    else
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" \
            -d "$data" \
            -w "\nStatus: %{http_code}")
    fi
    
    status_code=$(echo "$response" | grep "Status:" | cut -d' ' -f2)
    if [ $status_code -lt 400 ]; then
        echo -e "${GREEN}Success (Status: $status_code)${NC}"
    else
        echo -e "${RED}Failed (Status: $status_code)${NC}"
    fi
    echo "$response" | grep -v "Status:"
    echo "----------------------------------------"
}

echo "Testing Super Admin Permissions..."
SUPER_ADMIN_TOKEN=$(login "admin" "Admin123!@#")
if [ ! -z "$SUPER_ADMIN_TOKEN" ]; then
    make_request "GET" "/admin" "$SUPER_ADMIN_TOKEN"
    make_request "POST" "/admin" "$SUPER_ADMIN_TOKEN" '{"username":"testadmin","email":"test@example.com","password":"Test123!@#","roleId":"ROLE_ID"}'
    make_request "GET" "/users" "$SUPER_ADMIN_TOKEN"
    make_request "GET" "/roles" "$SUPER_ADMIN_TOKEN"
fi

echo -e "\nTesting Manager Permissions..."
MANAGER_TOKEN=$(login "manager" "Manager123!@#")
if [ ! -z "$MANAGER_TOKEN" ]; then
    make_request "GET" "/admin" "$MANAGER_TOKEN"
    make_request "POST" "/admin" "$MANAGER_TOKEN" '{"username":"testadmin2","email":"test2@example.com","password":"Test123!@#","roleId":"ROLE_ID"}'
    make_request "GET" "/users" "$MANAGER_TOKEN"
    make_request "GET" "/roles" "$MANAGER_TOKEN"
fi

echo -e "\nTesting User Admin Permissions..."
USER_ADMIN_TOKEN=$(login "useradmin" "UserAdmin123")
if [ ! -z "$USER_ADMIN_TOKEN" ]; then
    make_request "GET" "/admin" "$USER_ADMIN_TOKEN"
    make_request "POST" "/admin" "$USER_ADMIN_TOKEN" '{"username":"testadmin3","email":"test3@example.com","password":"Test123!@#","roleId":"ROLE_ID"}'
    make_request "GET" "/users" "$USER_ADMIN_TOKEN"
    make_request "POST" "/users" "$USER_ADMIN_TOKEN" '{"username":"testuser","email":"testuser@example.com","password":"Test123!@#"}'
    make_request "GET" "/roles" "$USER_ADMIN_TOKEN"
fi 