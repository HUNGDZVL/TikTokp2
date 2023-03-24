import { faSpinner, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountItem from '~/components/AccountItem';
import { SearchIcon } from '~/components/Icons';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';

const cx = classNames.bind(styles);
function Search() {
    const [searchValue, setSearchValue] = useState(''); //state dử dụng để get, set value (two waybindding)

    const [searchResult, setSearchResult] = useState([]); // state giúp hiện thị ra list tìm kiếm khi tìm kiếm

    const [showResult, setShowResult] = useState(true); // state de an hien tippy search input

    const inputRef = useRef(); //get element input to handle event focus

    useEffect(() => {
        setTimeout(() => {
            setSearchResult([1]); //Effect giúp hiên thị ra list tippy tìm kiếm thông qua setSearchResult
        }, 0);
    }, []);

    const handleClear = () => {
        setSearchValue(''); //set lai value input khi click
        setSearchResult([])// xoa ket qua tim kiem
        inputRef.current.focus(); //focus vao element input
    };

    const handleHideResult = () => {
        setShowResult(false);
    };
    return (
        <HeadlessTippy
            interactive
            visible={showResult && searchResult.length > 0} //dieu kien hien tippy list search
            render={(attrs) => (
                <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                    <PopperWrapper>
                        <h4 className={cx('search-title')}>Accounts</h4>
                        <AccountItem />
                        <AccountItem />
                        <AccountItem />
                        <AccountItem />
                    </PopperWrapper>
                </div>
            )}
            onClickOutside={handleHideResult}
            /* event khi click ngoai tippy */
        >
          
            <div className={cx('search')}>
                <input
                    ref={inputRef}
                    value={searchValue} // set value when write input
                    placeholder="Search accounts and videos"
                    spellCheck={false}
                    onChange={(e) => setSearchValue(e.target.value)} //get value inpur to use two waybiding
                    onFocus={() => setShowResult(true)}//khi focus thi hien lai tippy list

               />
                {!!searchValue && (
                    <button className={cx('clear')} onClick={handleClear}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                )}
                {/* <FontAwesomeIcon className={cx('loading')} icon={faSpinner} /> */}

                <button className={cx('search-btn')}>
                    <SearchIcon />
                </button>
            </div>
        </HeadlessTippy>
    );
}

export default Search;
