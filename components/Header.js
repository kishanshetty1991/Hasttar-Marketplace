import React, { useContext, useState } from 'react'
import { HasttarContext } from '../context/HasttarContext'
import logo from '../assets/hasttar-logo9.png'
import Image from 'next/image'
import { CgMenuGridO } from 'react-icons/cg'
import { IoMdSearch } from "react-icons/io"
import { FaCoins } from 'react-icons/fa'
import { BsNewspaper } from "react-icons/bs";
import Link from "next/link";
import data from '../data.json';

import { BsCaretRightFill } from "react-icons/bs";
import Cards from './Cards'

import {
    ModalProvider,
    Modal,
    useModal,
    ModalTransition,
} from 'react-simple-hook-modal'
import 'react-simple-hook-modal/dist/styles.css'
import BuyModal from './BuyModal'


const Header = () => {
    
    const styles = {
        container: `h-[60px] w-full flex items-center gap-5 px-16`,
        logo: `flex items-center ml-[10px] cursor-pointer flex-1`,
        search: `p-[25px] mr-30px w-[400px] h-[40px] bg-white rounded-full shadow-lg flex flex items-center border border-black`,
        searchInput: `bg-transparent focus:outline-none border-none flex-1 items-center flex`,
        menu: `flex items-center gap-6`,
        menuItem: `flex items-center text-md font-bold cursor-pointer`,
        coins: `ml-[10px]`,
        
    }
    
    const {balance} = useContext(HasttarContext)
    const { openModal, isModalOpen, closeModal } = useModal()
    const [searchTerm, setSearchTerm] = useState("")

    return {
        searchTerm,
        render:(
        // <ModalProvider>
        <div className={styles.container}>
            <div className={styles.logo}>
                <Link href="/">
                <Image
                    src={logo}
                    alt="hasttar"
                    height={100}
                    width={200}
                    className='object-cover'
                />
                </Link>
            </div>
            <div className={styles.search}>
                <input
                    id="Search"
                    type="text"
                    placeholder="Search Your Assets..."
                    className={styles.searchInput}
                    onChange={(event) => {
                        setSearchTerm(event.target.value);
                    }}
                />
                <IoMdSearch fontSize={20} />

            </div>
            {/* <Cards setSearchTerm= {setSearchTerm}/> */}
            {/* {console.log(searchTerm)} */}
            <div className={styles.menu}>
                <div className={styles.menuItem}><BsNewspaper/> &nbsp;<a href="https://nftnow.com/" target="_blank"  rel="noopener noreferrer"> NFT News</a></div>
                <div className={styles.menuItem}><a href="https://changelly.com/" target="_blank"  rel="noopener noreferrer">Buy Ethereum </a><BsCaretRightFill /></div>
                {balance ? (
                    <div
                        className={(styles.balance, styles.menuItem)}
                        title="Convert Eth to Hasttar Coins"
                        onClick={openModal}
                        >
                        {balance}
                        <FaCoins className={styles.coins} />
                        <Modal isOpen={isModalOpen} transition={ModalTransition.SCALE}>
                            <BuyModal close={closeModal}/>
                        </Modal>

                    </div>
                ) : (
                    <div className={(styles.balance, styles.menuItem)}
                        onClick={openModal}
                    >
                        0 AC <FaCoins className={styles.coins} />
                        <Modal isOpen={isModalOpen} transition={ModalTransition.SCALE}>
                            <BuyModal close={closeModal}/>
                        </Modal>

                    </div>

                )}
                <div title="Get Metamask">
                <a href="https://metamask.io/" target="_blank"  rel="noopener noreferrer">
                <CgMenuGridO fontSize={30} className={styles.menuItem}/>
                </a>
                </div>
            </div>

        </div>
        // </ModalProvider>
    )}
}

export default Header