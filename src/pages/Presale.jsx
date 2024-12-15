import React, { useEffect, useRef, useState } from "react";
import CountDown from "../components/chart/CountDown";
import { useAccount, useBalance, useChainId, useContractReads, useContractWrite, useWaitForTransaction } from "wagmi";
import { getContractResult, getErrorMessage, getFormattedDisplayNumber, getFormattedUnits } from "../utils/constants";
import { toast } from "react-toastify";
import { formatEther, parseEther } from "viem";
import { getBenkeiContract, getPresaleContract } from "../contracts";
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

function Presale() {
  const [value, setValue] = useState("");
  const { address } = useAccount();
  const chainId = useChainId()
  const { data: accountBalance } = useBalance({ address, watch: true })
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [softCap, setSoftCap] = useState(0);
  const [hardCap, setHardCap] = useState(0);
  const [minAmount, setMinAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(0)
  const [presaleRate, setPresaleRate] = useState(0)
  const [listingRate, setListingRate] = useState(0)
  const [totalDepositedEthAmount, setTotalDepositedEthAmount] = useState(0);
  const [totalSellingTokenAmount, setTotalSellingTokenAmount] = useState(0);
  const [userDepositEthAmount, setUserDepositEthAmount] = useState(0);
  const [counterDeadline, setCounterDeadline] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0)
  const refAmount = useRef(null)

  const stateText = ["Coming Soon.", "Presale is alive.", "Presale has ended.", "Presale was failed."];
  const btnText = ["Buy", "Buy", "Claim", "Refund"];
  const stateVal = {
    NotOpened: 0,
    Open: 1,
    End: 2,
    Fail: 3
  }
  const [presaleState, setPresaleState] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [txHash, setTxHash] = useState(null)
  const [pendingTx, setPendingTx] = useState(false);

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        ...getPresaleContract(chainId),
        functionName: "getContractInfo",
        args: [],
      },
      {
        ...getPresaleContract(chainId),
        functionName: "userDepositEthAmount",
        args: [address],
      },
      {
        ...getBenkeiContract(chainId),
        functionName: "totalSupply",
        args: [],
      },
    ]
  })

  const { data: TotalEthResult, isLoading: loadingT, isRefetching: isRefetchTTT, refetch: refetchTotalDepositedEther } = useContractReads({
    contracts: [
      {
        ...getPresaleContract(chainId),
        functionName: "totalDepositedEth",
        args: [],
      }
    ],

  })
  
  useEffect(() => {
    if (!contractResult) return
    setSoftCap(getFormattedUnits(contractResult[0].result[0][0]));
    setHardCap(getFormattedUnits(contractResult[0].result[0][1]));
    setStartTime(getFormattedUnits(contractResult[0].result[1][0], 0));
    setEndTime(getFormattedUnits(contractResult[0].result[1][1], 0));
    setPresaleRate(getFormattedUnits(contractResult[0].result[2][0]));
    setListingRate(getFormattedUnits(contractResult[0].result[2][1]));
    setMinAmount(getFormattedUnits(contractResult[0].result[3][0]));
    setMaxAmount(getFormattedUnits(contractResult[0].result[3][1]));

    setUserDepositEthAmount(getContractResult(contractResult[1]))
    if(contractResult[2].status === 'success')
      setTotalSupply(formatEther(contractResult[2].result))
    // const time = (new Date().getTime() / 1000).toFixed(0);
    // setTotalDepositedEthAmount(getContractResult(contractResult[4]));
    // setTotalSellingTokenAmount(getContractResult(contractResult[1]));
  }, [contractResult])

  useEffect(() => {
    if (!TotalEthResult) return
    const _totalDepositedEther = getContractResult(TotalEthResult[0])
    setTotalDepositedEthAmount(_totalDepositedEther)
    if (!contractResult) return
    const _endUnix = endTime * 1000;
    const currentTime = new Date().getTime();
    if (_endUnix < currentTime) {
      if (_totalDepositedEther < softCap) {
        setPresaleState(stateVal.Fail)
      } else {
        setPresaleState(stateVal.End)
      }
      // setCounterDeadline(0);
    }
    if (_totalDepositedEther >= hardCap) {
      setPresaleState(stateVal.End);
      // setCounterDeadline(0);
    }
  }, [TotalEthResult, contractResult, softCap, hardCap])

  useEffect(() => {
    if (contractResult) {
      const timerId = setInterval(() => {
        const _startUnix = startTime * 1000;
        const _endUnix = endTime * 1000;
        const currentTime = new Date().getTime();
        if (currentTime < _startUnix) {
          setPresaleState(stateVal.NotOpened);
          setCounterDeadline(_startUnix);  
        } else if (_startUnix <= currentTime && currentTime <= _endUnix) {
          setCounterDeadline(_endUnix)
          setPresaleState(stateVal.Open)
        } else if (_endUnix < currentTime) {
          setCounterDeadline(0);
        } 
        refetchTotalDepositedEther()
        // setRefresh(!refresh)
      }, 1000);
      
      return () => {
        clearInterval(timerId);
      }
    }
  }, [contractResult, startTime, endTime])

  const { writeAsync: Deposit } = useContractWrite({
    ...getPresaleContract(chainId),
    functionName: "invest",
    onSuccess: (data) => {
      toast.success("Transaction Submitted!")
      setTxHash(data.hash)
    },
    onError: (data) => {
      toast.error(getErrorMessage(data))
      setTxHash(null)
      setPendingTx(false)
    }
  })

  const { writeAsync: Claim } = useContractWrite({
    ...getPresaleContract(chainId),
    functionName: "claimToken",
    onSuccess: (data) => {
      toast.success("Transaction Submitted!")
      setTxHash(data.hash)
    },
    onError: (data) => {
      toast.error(getErrorMessage(data))
      setTxHash(null)
      setPendingTx(false)
    }
  })

  const { writeAsync: Refund } = useContractWrite({
    ...getPresaleContract(chainId),
    functionName: "claimRefund",
    onSuccess: (data) => {
      toast.success("Transaction Submitted!")
      setTxHash(data.hash)
    },
    onError: (data) => {
      toast.error(getErrorMessage(data))
      setTxHash(null)
      setPendingTx(false)
    }
  })

  const { writeAsync: finishSale } = useContractWrite({
    ...getPresaleContract(chainId),
    functionName: "finishSale",
    onSuccess: (data) => {
      toast.success("Transaction Submitted!")
      setTxHash(data.hash)
    },
    onError: (data) => {
      toast.error(getErrorMessage(data))
      setTxHash(null)
      setPendingTx(false)
    }
  })

  useWaitForTransaction({
    hash: txHash,
    onSuccess: (data) => {
      toast.success("Transaction Success!")
      setTxHash(null)
      refetchTotalDepositedEther()
      setPendingTx(false)
    }
  })

  const handleAction = async () => {
    if (presaleState == stateVal.Open) {
      if(totalDepositedEthAmount>hardCap) {
        toast.error("Presale: Hardcap reached!")
        return
      }
      let ethVal = parseFloat(refAmount.current.value)
      if (!ethVal) return;
      setPendingTx(true)
      Deposit({
        args: [],
        from: address,
        value: parseEther(ethVal.toString())
      });
    } else if (presaleState == stateVal.End) {
      setPendingTx(true)
      Claim({
        args: [],
        from: address
      });
    } else if (presaleState == stateVal.Fail) {
      setPendingTx(true)
      Refund({
        args: [],
        from: address
      })
    }
  }

  const setInputMax = () => {
    if(!accountBalance) {
      refAmount.current.value = 0
      return
    }
    refAmount.current.value = Number(accountBalance.formatted) > Number(maxAmount)? maxAmount : accountBalance.formatted-0.01
    setInputValue(accountBalance.formatted)
  }

  const handleInput = (e) => {
    let val = e.target.value;
    if(!accountBalance) {
      refAmount.current.value = 0
      return
    }
    const max = Number(accountBalance.formatted) > Number(maxAmount)? maxAmount : accountBalance.formatted
    if (max && parseFloat(val) > parseFloat(max))
      refAmount.current.value = max
    else if (val < 0)
      refAmount.current.value = 0
  }

  return (
    <>
      <div className="mint__container flex flex-col items-center">
        <section className="flex flex-col mx-auto top-padding gap-5">
          <div className="title-64 caelum-text1 text-center">Welcome to Benkei Presale</div>
          <div className="title-20 caelum-text1 text-center">Benkei plays a crucial role in our project ecosystem. By participating in our benkei presale, you can secure a portion of benkei at a discounted price. These tokens will grant you access to various features and benefits within our platform.</div>
        </section>


        <section className="w-full top-padding md:flex items-center justify-center gap-[1vw] md:gap-[10vw] md:!mt-[60px] !mt-[60px] flex flex-wrap">
          <div className="caelum-paper py-[20px] px-[50px] mb-[30px] !border-[#fff] w-[530px]">
            <div className="flex justify-between items-center w-full mb-3">
              <div className="title-20 caelum-text1 text-center">Presale Rate</div>
              <div className="title-20">{getFormattedDisplayNumber(presaleRate)} BNK / 1 ETH</div>
            </div>
            <div className="flex justify-between items-center w-full mb-3">
              <div className="title-20 caelum-text1 text-center">Listing Rate</div>
              <div className="title-20">{getFormattedDisplayNumber(listingRate)} BNK / 1 ETH</div>
            </div>
            <div className="flex justify-between items-center w-full mb-3">
              <div className="title-20 caelum-text1 text-center">Softcap</div>
              <div className="title-20">{softCap} ETH</div>
            </div>
            <div className="flex justify-between items-center w-full mb-3">
              <div className="title-20 caelum-text1 text-center">Hardcap</div>
              <div className="title-20">{hardCap} ETH</div>
            </div>
            <div className="flex justify-between items-center w-full mb-3">
              <div className="title-20 caelum-text1 text-center">Min Contribution</div>
              <div className="title-20">{getFormattedDisplayNumber(minAmount)} ETH</div>
            </div>
            <div className="flex justify-between items-center w-full mb-3">
              <div className="title-20 caelum-text1 text-center">Max Contribution</div>
              <div className="title-20">{getFormattedDisplayNumber(maxAmount)} ETH</div>
            </div>
            <div className="flex justify-between items-center w-full mb-3">
              <div className="title-20 caelum-text1 text-center">Initial Supply</div>
              <div className="title-20">{getFormattedDisplayNumber(totalSupply, 0)} BNK</div>
            </div>
            <div className="flex justify-between items-center w-full mb-3">
              <div className="title-20 caelum-text1 text-center">Tokens For Presale</div>
              <div className="title-20">{getFormattedDisplayNumber(hardCap * presaleRate)} BNK</div>
            </div>
            {/* <div className="flex justify-between items-center w-full mb-3">
              <div className="title-20 caelum-text1 text-center">Total ETH Raised</div>
              <div className="title-20">{totalDepositedEthAmount.toLocaleString()}</div>
            </div> */}
          </div>
          {/* <div className="caelum-paper py-[20px] px-[50px] mb-[30px] !border-[#fff] w-[330px]">
            <div className="text-[18px] text-center font-semibold mb-[30px]">Total BENKEI for Sale</div>
            <div className="flex items-center justify-center gap-2">
              <div className="text-[26px] text-[#d49c44] font-bold">25,000</div>
              <img className="w-[40px] h-[40px]" src={calLogo}></img>
            </div>
          </div> */}
        </section>
        <section className="w-full top-padding md:flex items-center justify-center gap-[1vw] md:gap-[10vw] md:!mt-[60px] !mt-[60px] flex flex-wrap">
          <div className="caelum-paper py-[20px] px-[50px] mb-[30px] !border-[#fff] w-[530px]">
            <section className="w-full">
              <div className="title-36 text-center mb-8">{contractResult ? stateText[presaleState] : "Loading..."}</div>
              <CountDown end={counterDeadline} />
            </section>
            <section className="w-full pt-[30px] md:pt-[50px]">
              {/* <CircleChart softcap={softCap} hardcap={hardCap} cap={totalDepositedEthAmount} /> */}
              <div className="flex justify-between items-center">
                <div>Softcap: {softCap} ETH</div>
                <div>Hardcap: {hardCap} ETH</div>
              </div>
              <Progress
                className="max-w-[500px] m-auto my-3"
                strokeWidth={5}
                percent={softCap === 0 || hardCap === 0? 0 :
                  totalDepositedEthAmount<=softCap? getFormattedDisplayNumber(totalDepositedEthAmount * 100 / softCap, 2) :
                  totalDepositedEthAmount>hardCap? 100: getFormattedDisplayNumber(totalDepositedEthAmount * 100 / hardCap, 2)}
                status="active"
              />
              <div className="text-right">Raised: {getFormattedDisplayNumber(totalDepositedEthAmount)} ETH</div>
            </section>
            {presaleState === stateVal.Open && <div className="md:!mt-[50px] !mt-[30px]">
              
              {/* <div className="flex justify-between items-center mb-3">
                <div>Min Contribution: {getFormattedDisplayNumber(minAmount)} ETH</div>
                <div>Max Contribution: {getFormattedDisplayNumber(maxAmount)} ETH</div>
              </div> */}
              <section className="">
                <div className="border border-[#fff] rounded-[28px] text-[16px] md:text-[18px] p-[20px]">
                  <div className="flex items-center justify-between">
                    <div className="text-[#fff]">Amount</div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="text-[#fff]">Balance: {accountBalance ? getFormattedDisplayNumber(accountBalance.formatted) : "0"}</div>
                      <div className="font-bold text-[#d49c44] cursor-pointer" onClick={() => setInputMax()}>MAX</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
                      className="h-full w-full mt-[25px] md:mt-[20px] text-[30px] md:text-[26px] pr-[20px] bg-transparent"
                      ref={refAmount} onChange={handleInput}
                      disabled={presaleState != stateVal.Open}
                    />
                    <div className="flex items-center justify-center gap-3 mt-[30px]">
                      {/* <img className="h-[40px] w-[40px]" src={Ethereum} /> */}
                      <div className="font-bold text-[#fff]">ETH</div>
                    </div>
                  </div>
                </div>
              </section>
              
              {refAmount.current && Number(refAmount.current.value) !== 0 && <div className="flex items-center justify-center">
                  <span className="mt-5">You will be able to claim {getFormattedDisplayNumber(refAmount.current.value * presaleRate)} BENKEI</span>
                </div>
              }
            </div>}


            {/* <span>You will be able to claim {refAmount.current.value * presaleRate} tokens</span> */}
            <section className="w-full top-padding flex flex-col items-center justify-center">
              
              {presaleState === stateVal.End && <div>
                <div className="pb-5">You can claim {getFormattedDisplayNumber(userDepositEthAmount * presaleRate)} BENKEI</div>
              </div>}
              <button
                className="!h-auto w-full max-w-[140px] primary-btn text-center !text-[18px] !py-[15px]"
                disabled={presaleState == stateVal.NotOpened || pendingTx}
                // disabled
                onClick={handleAction}
              >
                {pendingTx && <div className="presale-loader"></div>}
                {btnText[presaleState]}
              </button>
            </section>



          </div>
        </section>
        {/* <section className="w-full top-padding">
          <div className="title-20 caelum-text1 md:text-left text-center">
          During this presale, you will have the exclusive opportunity to purchase our tokens at a discounted rate. By participating in the presale, you not only benefit from a lower price, but you also gain early access to our platform and its future potential.<br />
            <br />
            Our blockchain technology is set to revolutionize various industries, providing transparency, security, and efficiency like never before. By investing in our tokens, you become an integral part of this transformative journey.<br />
            <br />
          </div>
        </section> */}
      </div>
    </>
  );
}

export default Presale;
