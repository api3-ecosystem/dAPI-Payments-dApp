import React, { useEffect,useState } from 'react'
import {
    Flex,
    Box,
    Stack,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
} from '@chakra-ui/react';

import { ethers } from 'ethers';
// import { WETHabi } from './abi/WETH.json';
// import { WMATICabi } from './abi/WMATIC.json';

export default function Form(props) {
  const [token, setToken] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [sendBtnText, setSendBtnText] = useState('Send Payment');
  const ERC20ABI = require('./abi/WETH.json');

  const setTokenHandler = async (e) => {
    e.preventDefault();
    console.log("Setting Token");
    const token = e.target.value;
    setToken(token);
    console.log(token)
    PaymentsHandler(token);
  }

  // const setWeth = async => {
  //   const token = "0x45b68a86e5f4cfE1F5002aA1A528E367FEA3a7d6";
  //   console.log(token)
  //   PaymentsHandler(token);
  // }
  // const setWmatic = async => {
  //   const token = "0xf12Fd06B008739F18732F972782375DDBa1c3527";
  //   PaymentsHandler(token);
  // }


  const PaymentsHandler = async (token) => {
    console.log("Approving Payment");
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);


    const signer = tempProvider.getSigner();
    setSigner(signer);
    console.log("Signer set successfully")

    console.log(signer)

    let contract = new ethers.Contract(token, ERC20ABI, signer);
    setContract(contract);
    console.log("Contract Loaded Successfully")

    try {
      const approve = await contract.approve('0x1D982184951f7A1C819a1eD6879C14af0Aa83cD7', '10000000000000000000', { gasLimit: 1000000 });
      await approve.await();
      console.log("Approved Successfully")
    } catch (err) {
      console.error(err);
    }
  };

  const sendPayment = async (e) => {
    e.preventDefault();
    console.log("Sending Payment");
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    const signer = tempProvider.getSigner();
    setSigner(signer);
    console.log("Signer set successfully")

    console.log(signer)
    const PaymentsContractAddress = "0x1D982184951f7A1C819a1eD6879C14af0Aa83cD7";
    const PaymentsABI = require('./abi/Payments.json');
    let contract = new ethers.Contract(PaymentsContractAddress, PaymentsABI, signer);
    setContract(contract);
    console.log("Payments Contract Loaded Successfully")

    let amount = e.target.sendamount.value;
    const transferAmount = ethers.utils.parseEther(amount);
    console.log(transferAmount)
    try {
      const pay = await contract.Payment(token, transferAmount, { gasLimit: 1000000 });
      await pay.wait();
      console.log("Payment made to the contract!")
    } catch (err) {
      console.error(err);
    }
  }

    return (
        <Flex width="full" align="center" justifyContent="center">
            <Box p={2}>
                <Box textAlign="center">
                    <Heading>Send Payments to the Contract</Heading>
                </Box>
                <Box my={4} textAlign="left">
          <form>
            <FormControl>
              <FormLabel>Select token to pay</FormLabel>
              <Stack direction='row' spacing={4} align='center'>
              <Button colorScheme='blue' value={'0x45b68a86e5f4cfE1F5002aA1A528E367FEA3a7d6'} onClick={e => setTokenHandler(e, "value")}>WETH</Button>
              <Button colorScheme='blue' value={'0xf12Fd06B008739F18732F972782375DDBa1c3527'} onClick={e => setTokenHandler(e, "value")}>WMATIC</Button>
              </Stack>
            </FormControl>
            </form>
            <form onSubmit={sendPayment}>
            <FormControl mt={6}>
              <FormLabel>Enter the amount</FormLabel>
              <Input type="number" id='sendamount'/>
              <Button width="full" mt={4} type="submit">
                { sendBtnText }
              </Button>
            </FormControl>
          </form>
        </Box>
            </Box>
        </Flex>
    );
}