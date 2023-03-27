import { faSpinner, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef } from 'react';
import {useDebounce} from'~/hooks';

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

     const [loading, setLoading] = useState(false);// state de an hien icon loading khi dang nhap ki tu vo input 

    const debounce = useDebounce(searchValue,500);

    const inputRef = useRef(); //get element input to handle event focus

    useEffect(() => {
        // neu nhu searchValue khong co thi thoat ham khong goi api
        if (!debounce.trim()) {
            //trim() loai bo ki tu trong
            setSearchResult([]); // khi xoa het thi set lai typpi thanh mang rong de an di
            return;
        }

        setLoading(true);

        //Effect getAPI giúp hiên thị ra list tippy tìm kiếm thông qua setSearchResult khi user go vao o tim kiem
        fetch(`https://tiktok.fullstack.edu.vn/api/users/search?q=${encodeURIComponent(debounce)}&type=less`) //mothod encode giup loai bo cac ki tu dac biet gay error link url
            .then((res) => res.json()) //chuyen doi du lieu json sang javascript
            .then((res) => {
                setSearchResult(res.data); //chot vo data trong api de lay value
                setLoading(false);
            })
            .catch(() => {
                setLoading(false); //loading khi erro
            });
    }, [debounce]);

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
            visible={showResult && searchResult.length > 0} //dieu kien hien tippy list search khi thoa 2 dieu kien
            render={(attrs) => (
                <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                    <PopperWrapper>
                        <h4 className={cx('search-title')}>Accounts</h4>
                       {searchResult.map(result =>(// map ket qua tra ve từ api để rander ra giao diện ng dùng
                           <AccountItem key={result.id} data={result}/>// truyen props data vao component AccountItem de render data tu api vao component

                       ))}
                     
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
                {!!searchValue && !loading  && (// neu co ki tu trong input thi thuc hien hanh vi click icon x de delete ki tu va focus lai input
                    <button className={cx('clear')} onClick={handleClear}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                )}
                { loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} /> } 
                {/* neu co loading thi hien icon */}

                <button className={cx('search-btn')}>
                    <SearchIcon />
                </button>
            </div>
        </HeadlessTippy>
    );
}

export default Search;
