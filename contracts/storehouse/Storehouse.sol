//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//import "hardhat/console.sol";

contract Storehouse {
    struct File {
        address payable file_owner;
        string file_name;
        string file_path;
        string file_uid;
        string file_type;
        uint256 file_size;
    }

    event FileUploaded(
        address payable file_owner,
        string file_name,
        string file_path,
        string file_uid,
        string file_type,
        uint256 file_size
    );

    event FileShared(
        address payable file_owner,
        address file_receiver,
        string file_name,
        string file_path,
        string file_uid,
        string file_type,
        uint256 file_size
    );

    mapping(address => File[]) private files;

    function getFiles() public view returns (File[] memory) {
        return files[msg.sender];
    }

    function uploadFile(
        string memory _file_path,
        string memory _file_name,
        string memory _file_uid,
        string memory _file_type,
        uint256 _file_size
    ) external payable {
        require(bytes(_file_path).length > 0);
        require(bytes(_file_type).length > 0);
        require(bytes(_file_name).length > 0);
        require(bytes(_file_uid).length > 0);
        require(msg.sender != address(0));
        require(_file_size > 0);

        files[msg.sender].push(
            File(
                payable(msg.sender),
                _file_name,
                _file_path,
                _file_uid,
                _file_type,
                _file_size
            )
        );

        emit FileUploaded(
            payable(msg.sender),
            _file_name,
            _file_path,
            _file_uid,
            _file_type,
            _file_size
        );
    }

    function deleteFile(string memory uid) external payable {
        uint256 index = 0;
        for (uint256 i = 0; i < files[msg.sender].length; i++) {
            if (
                keccak256(bytes(files[msg.sender][i].file_uid)) ==
                keccak256(bytes(uid))
            ) {
                index = i;
            }
        }
        delete files[msg.sender][index];
    }

    function shareFile(
        address receiver,
        string memory _file_path,
        string memory _file_name,
        string memory _file_uid,
        string memory _file_type,
        uint256 _file_size
    ) external payable {
        require(bytes(_file_path).length > 0);
        require(bytes(_file_type).length > 0);
        require(bytes(_file_name).length > 0);
        require(bytes(_file_uid).length > 0);
        require(receiver != address(0));
        require(_file_size > 0);

        files[receiver].push(
            File(
                payable(msg.sender),
                _file_name,
                _file_path,
                _file_uid,
                _file_type,
                _file_size
            )
        );

        emit FileShared(
            payable(msg.sender),
            receiver,
            _file_name,
            _file_path,
            _file_uid,
            _file_type,
            _file_size
        );
    }

    function uploadMultipleFiles(File[] memory _files) external payable {
        for (uint256 i = 0; i < _files.length; i++) {
            string memory _file_path = _files[i].file_path;
            string memory _file_type = _files[i].file_type;
            uint256 _file_size = _files[i].file_size;
            string memory _file_name = _files[i].file_name;
            string memory _file_uid = _files[i].file_uid;

            require(bytes(_file_path).length > 0);
            require(bytes(_file_type).length > 0);
            require(bytes(_file_name).length > 0);
            require(bytes(_file_uid).length > 0);
            require(msg.sender != address(0));
            require(_file_size > 0);

            files[msg.sender].push(
                File(
                    payable(msg.sender),
                    _file_name,
                    _file_path,
                    _file_uid,
                    _file_type,
                    _file_size
                )
            );

            emit FileUploaded(
                payable(msg.sender),
                _file_name,
                _file_path,
                _file_uid,
                _file_type,
                _file_size
            );
        }
    }
}
