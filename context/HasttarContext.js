import { createContext, useState, useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { hasttarAbi, hasttarCoinAddress } from "../lib/constants";
import { ethers } from "ethers";
import { web3 } from "web3"


export const HasttarContext = createContext()

export const HasttarProvider = ({ children }) => {
    const [username, setUsername] = useState('')
    const [nickname, setNickname] = useState('')
    const [assets, setAssets] = useState([])
    const [currentAccount, setCurrentAccount] = useState('')
    const [tokenAmount, setTokenAmount] = useState('')
    const [amountDue, setAmountDue] = useState('')
    const [etherscanLink, setEtherscanLink] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [balance, setBalance] = useState('')
    const [recentTransactions, setRecentTransactions] = useState([])
    const [ownedItems, setOwnedItems] = useState([])


    const {
        authenticate,
        isAuthenticated,
        enableWeb3,
        Moralis,
        user,
        isWeb3Enabled,
        web3,
    } = useMoralis()


    const {
        data: assetsData,
        error: assetsDataError,
        isLoading: assetsDataisLoading,
    } = useMoralisQuery('assets')


    const {
        data: userData,
        error: userDataError,
        isLoading: userDataisLoading
    } = useMoralisQuery('_User')


    const listenToUpdates = async () => {
        let query = new Moralis.Query('EthTransactions')
        let subscription = await query.subscribe()
        subscription.on('update', async object => {
            console.log("New Transactions")
            console.log(object)
            setRecentTransactions([object])
        })
    }

    const getBalance = async () => {
        try {
            if (!isAuthenticated || !currentAccount) return
            const options = {
                contractAddress: hasttarCoinAddress,
                functionName: 'balanceOf',
                abi: hasttarAbi,
                params: {
                    account: currentAccount,
                },
            }
            if (isWeb3Enabled) {
                const response = await Moralis.executeFunction(options)
                console.log(response.toString())
                setBalance(response.toString())
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        (async () => {
            if (isAuthenticated) {
                await getBalance()
                await listenToUpdates()
                const currentUsername = await user?.get('nickname')
                setUsername(currentUsername)
                const account = await user?.get('ethAddress')
                setCurrentAccount(account)
            }
        })()
    }, [isAuthenticated, user, username, currentAccount, getBalance, listenToUpdates])


    useEffect(() => {
        (async () => {
            //console.log(assetsData)
            if (isWeb3Enabled) {
                await getAssets()
                await getOwnedAssets()
            }
        })()
    }, [isWeb3Enabled, assetsData])

    const handleSetUsername = () => {
        if (user) {
            if (nickname) {
                user.set('nickname', nickname)
                user.save()
                setNickname('')
            }
            else {
                console.log("Can't set empty nickname")
            }
        }
        else {
            console.log("No user");
        }
    }


    const buyAsset = async (price, asset) => {
        try {
            if (!isAuthenticated) return

            const options = {
                type: 'erc20',
                amount: price,
                receiver: hasttarCoinAddress,
                contractAddress: hasttarCoinAddress
            }
            let transaction = await Moralis.transfer(options)
            const receipt = await transaction.wait()
            if (receipt) {
                const res = userData[0].add('ownedAssets', {
                    ...asset,
                    purchaseDate: Date.now(),
                    etherscanLink: `https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`
                })


                await res.save().then(() => {
                    alert("You've successfully purchased this asset!")
                })
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    const connectWallet = async () => {
        await enableWeb3()
        await authenticate()
    }

    const buyTokens = async () => {
        if (!isAuthenticated) {
            await connectWallet()
        }
        const amount = ethers.BigNumber.from(tokenAmount)
        const price = ethers.BigNumber.from('100000000000000')
        const calcPrice = amount.mul(price)

        console.log("Here", hasttarCoinAddress)

        let options = {
            contractAddress: hasttarCoinAddress,
            functionName: 'mint',
            abi: hasttarAbi,
            msgValue: calcPrice,
            params: {
                amount,
            }
        }

        const transaction = await Moralis.executeFunction(options)
        const receipt = await transaction.wait(4)
        setIsLoading(false)
        console.log("There", receipt)
        setEtherscanLink(
            `https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`,
        )
    }

    

    const getAssets = async () => {
        try {
            await enableWeb3()
            //console.log("Running")
            setAssets(assetsData)
            //console.log("After setting", assetsData)
        }
        catch (error) {
            console.log(error)
        }
    }


    const getOwnedAssets = async () => {
        try{
            if(userData[0].attributes.ownedAssets){
                setOwnedItems(prevItems => [
                    ...prevItems, userData[0].attributes.ownedAssets
                ])
            }
        }
        catch(error){
            console.log(error)
        }
    }

    return (
        <HasttarContext.Provider
            value={{
                isAuthenticated,
                nickname,
                setNickname,
                username,
                setUsername,
                handleSetUsername,
                amountDue,
                setAmountDue,
                assets,
                balance,
                getBalance,
                setTokenAmount,
                tokenAmount,
                isLoading,
                setIsLoading,
                setEtherscanLink,
                etherscanLink,
                currentAccount,
                buyTokens,
                buyAsset,
                recentTransactions,
                ownedItems,

            }}
        >
            {children}
        </HasttarContext.Provider>
    )
}