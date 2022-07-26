import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { HasttarContext } from '../context/HasttarContext'
import Transaction from '../components/Transaction'


const History = () => {

    const styles = {
        container: `h-full w-full flex bg-[#fff]`,
        main: `w-full h-full flex flex-col mt-[50px]`,
        tableContainer: `w-full h-full flex flex-col p-[100px] justify-center`,
        pageTitle: `text-2xl font-bold text-left mt-[50px] mb-[30px]`,
        transactions: `flex gap-[50px] flex-row flex-wrap`,
    }

    const { ownedItems } = useContext(HasttarContext)
    const {render, searchTerm} = Header();
    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.main}>
                {render}
                <div className={styles.tableContainer}>
                    {ownedItems ? (
                        <div className={styles.pageTitle}>Purchase History</div>
                    ) : (
                        <div className={styles.pageTitle}>No Purchase History</div>
                    )}

                    {/* {console.log("Owned")}
                    {console.log(ownedItems)} */}
                    <div className={styles.transactions}>
                        {ownedItems.map((item, index) => {
                            return <Transaction key={index} item={item} index={index} />
                        }) }
                    </div>
                </div>

            </div>

        </div>
    )
}

export default History