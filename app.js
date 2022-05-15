document.addEventListener('DOMContentLoaded', () => {
    //Unpkg imports
    const Web3Modal = window.Web3Modal.default
    const WalletConnectProvider = window.WalletConnectProvider.default
    let provider

    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: '23729665ba9543a981510918a6a4b835',
            },
        },
    }

    let web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
        disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    })

    // Update message
    let setResult = (result) => {
        document.getElementById("result").classList.remove("hidden")
        let content = document.getElementById('signature')
        content.innerHTML = result
    }

    let connectBtn = document.getElementById("connect")
    connectBtn.addEventListener("click", async () => {
        // connectBtn.classList.add("hidden")
        await window.Web3Modal.removeLocal('walletconnect')
        try {
            provider = await web3Modal.connect()
            provider = new ethers.providers.Web3Provider(provider)
            provider.on("network", updateNetwork)
        } catch (err) {
            // connectBtn.classList.remove("hidden")
            const msg = 'Could not get a wallet connection'
            console.log(msg, err)
        }
    })

    let textarea = document.getElementById("content")
    textarea.addEventListener("change", () => {
        const sig = document.getElementById('signature')
        sig.innerHTML = ''
        document.getElementById('result').classList.add('hidden')
    })

    const updateNetwork = async (network) => {
        document.getElementById("connect-page").classList.add("hidden")
        document.getElementById("ui").classList.remove("hidden")
    }

    let signBtn = document.getElementById("sign")
    signBtn.addEventListener("click", async () => {
        signBtn.classList.add("hidden")

        const content = document.getElementById('content').value

        const signer = provider.getSigner()
        const signature = await signer.signMessage(content)
        const addr = await signer.getAddress()
        const data = {
            sig : signature,
            message : content,
            addr : addr
        }
        setResult(JSON.stringify(data, null, 2))
        signBtn.classList.remove("hidden")
    })

})
