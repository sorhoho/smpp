package main

import (
	"fmt"
	"log"
	"strings"
	"sync"
	"time"
	"math/rand"
	"strconv"

	"github.com/linxGnu/gosmpp"
	"github.com/linxGnu/gosmpp/data"
	"github.com/linxGnu/gosmpp/pdu"
)

func main() {
	var wg sync.WaitGroup

	wg.Add(1)
	go sendingAndReceiveSMS(&wg)

	wg.Wait()
	fmt.Println("All Done")

}

func sendingAndReceiveSMS(wg *sync.WaitGroup) {
	defer wg.Done()

	auth := gosmpp.Auth{
		SMSC:       "localhost:80",
		SystemID:   "test",
		Password:   "123456",
		SystemType: "",
	}

	trans, err := gosmpp.NewSession(
		gosmpp.TRXConnector(gosmpp.NonTLSDialer, auth),
		gosmpp.Settings{
			EnquireLink: 5 * time.Second,

			ReadTimeout: 60 * time.Second,

			OnSubmitError: func(_ pdu.PDU, err error) {
				log.Fatal("SubmitPDU error:", err)
			},

			OnReceivingError: func(err error) {
				fmt.Println("Receiving PDU/Network error:", err)
			},

			OnRebindingError: func(err error) {
				fmt.Println("Rebinding but error:", err)
			},

			OnPDU: handlePDU(),

			OnClosed: func(state gosmpp.State) {
				fmt.Println(state)
			},
		}, 60*time.Second)
	if err != nil {
		log.Println(err)
	}
	defer func() {
		_ = trans.Close()
	}()

	// sending SMS(s)
	for i := 0; i < 20000; i++ {
		if err = trans.Transceiver().Submit(newSubmitSM()); err != nil {
			fmt.Println(err) }
		// sleep 500 Milliseconds
                // time.Sleep(1000 * time.Millisecond)
		//time.Sleep(time.Second) 
                 time.Sleep(10 * time.Millisecond)
		 // time.Sleep(500 * time.Nanosecond)
		 fmt.Println(i)
	}

     time.Sleep(120 * time.Second)

}

func handlePDU() func(pdu.PDU, bool) {
	concatenated := map[uint8][]string{}
	return func(p pdu.PDU, _ bool) {
		switch pd := p.(type) {
		case *pdu.SubmitSMResp:
			fmt.Printf("SubmitSMResp:%+v\n", pd)

		case *pdu.GenericNack:
			fmt.Println("GenericNack Received")

		case *pdu.EnquireLinkResp:
			fmt.Println("EnquireLinkResp Received")

		case *pdu.DataSM:
			fmt.Printf("DataSM:%+v\n", pd)

		case *pdu.DeliverSM:
			fmt.Printf("DeliverSM:%+v\n", pd)
			log.Println(pd.Message.GetMessage())
			// region concatenated sms (sample code)
			message, err := pd.Message.GetMessage()
			if err != nil {
				log.Fatal(err)
			}
			totalParts, sequence, reference, found := pd.Message.UDH().GetConcatInfo()
			if found {
				if _, ok := concatenated[reference]; !ok {
					concatenated[reference] = make([]string, totalParts)
				}
				concatenated[reference][sequence-1] = message
			}
			if !found {
				log.Println(message)
			} else if parts, ok := concatenated[reference]; ok && isConcatenatedDone(parts, totalParts) {
				log.Println(strings.Join(parts, ""))
				delete(concatenated, reference)
			}
			// endregion
		}
	}
}

func newSubmitSM() *pdu.SubmitSM {
	// build up submitSM
	srcAddr := pdu.NewAddress()
	srcAddr.SetTon(5)
	srcAddr.SetNpi(0)
	_ = srcAddr.SetAddress("00" + "522241")


	destAddr := pdu.NewAddress()
	destAddr.SetTon(1)
	destAddr.SetNpi(1)
	//_ = destAddr.SetAddress("99" + "522241")

	min := 66200000000
        max := 66999999999
	 _ = destAddr.SetAddress(strconv.Itoa(rand.Intn(max - min) + min))

	submitSM := pdu.NewSubmitSM().(*pdu.SubmitSM)
	submitSM.SourceAddr = srcAddr
	submitSM.DestAddr = destAddr
	_ = submitSM.Message.SetMessageWithEncoding("สวีสดีครับ นี่เป็นการ test sms จาก golang client", data.UCS2)
	submitSM.ProtocolID = 0
	submitSM.RegisteredDelivery = 1
	submitSM.ReplaceIfPresentFlag = 0
	submitSM.EsmClass = 0

	return submitSM
}

func isConcatenatedDone(parts []string, total byte) bool {
	for _, part := range parts {
		if part != "" {
			total--
		}
	}
	return total == 0
}
