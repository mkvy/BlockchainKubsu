package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

const walletAddress = "tb1qr3shrxc95yjkk5ygfm3zmup7g7sc36nr8lv7l6rd4ft2jec0e5rsz4espp"

func main() {
	url := fmt.Sprintf("https://api.blockcypher.com/v1/btc/test3/addrs/%s/balance", walletAddress)
	resp, err := http.Get(url)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	var dat map[string]interface{}
	if err := json.Unmarshal(body, &dat); err != nil {
		panic(err)
	}
	balance, ok := dat["balance"].(float64)
	if ok {
		balance /= 100000000
		fmt.Printf("balance: %f\n", balance)
	}
}
