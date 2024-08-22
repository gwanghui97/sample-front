import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Title, Table, Th, Td, WriteButton, GridContainer, GridItem, ImageContainer, AuthorName, Pagination, PageButton } from './BoardStyles';

const BoardPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 권한 상태값
  const navigate = useNavigate();
  const { boardType } = useParams();

  const postsPerPage = boardType === 'B' ? 6 : 10;

  useEffect(() => {
    fetchPosts();
    checkAdminStatus(); // 관리자 권한 확인
  }, [boardType, currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/boards?type=${boardType}&page=${currentPage}&size=${postsPerPage}`);
      setPosts(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('게시글을 불러오는데 실패했습니다:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = async () => {
    // 여기에 관리자 권한을 확인하는 로직 추후에 추가
    try {
      const response = await axios.get('http://localhost:8080/user/role');
      setIsAdmin(response.data.role === 'ADMIN');
    } catch (error) {
      console.error('사용자 권한 확인 실패:', error);
      setIsAdmin(false);
    }
  };

  const getBoardTitle = () => {
    switch(boardType) {
      case 'R': return '매칭 후기';
      case 'B': return '자랑';
      case 'A': return '공지사항';
      case 'I': return '신고/문의';
      default: return '게시판';
    }
  };

  const renderBoastBoard = () => (
    <GridContainer>
      {posts.map((post) => (
        <GridItem key={post.board_id} onClick={() => navigate(`/boards/${boardType}/${post.board_id}`)}>
          <ImageContainer>
            <img src={post.content_img} alt={post.title} />
          </ImageContainer>
          <AuthorName>{post.member_id}</AuthorName>
        </GridItem>
      ))}
    </GridContainer>
  );

  const renderOtherBoard = () => (
    <Table>
      <thead>
        <tr>
          <Th>번호</Th>
          <Th>제목</Th>
          <Th>작성자</Th>
          <Th>작성일</Th>
          {boardType === 'I' && <Th>상태</Th>}
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr key={post.board_id} onClick={() => navigate(`/boards/${boardType}/${post.board_id}`)}>
            <Td>{post.board_id}</Td>
            <Td>{post.title}</Td>
            <Td>{post.member_id}</Td>
            <Td>{new Date(post.created_at).toLocaleDateString()}</Td>
            {boardType === 'I' && <Td>{post.inquiry_status}</Td>}
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderPagination = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 5);
    
    if (endPage - startPage < 5 && startPage > 1) {
      startPage = Math.max(1, endPage - 5);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <Pagination>
        <PageButton onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
          이전
        </PageButton>
        {pageNumbers.map(number => (
          <PageButton key={number} onClick={() => setCurrentPage(number)} active={currentPage === number}>
            {number}
          </PageButton>
        ))}
        <PageButton onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
          다음
        </PageButton>
      </Pagination>
    );
  };

  return (
    <Container>
      <Title>{getBoardTitle()}</Title>
      {boardType === 'B' ? renderBoastBoard() : renderOtherBoard()}
      {renderPagination()}
      {(boardType !== 'A' || (boardType === 'A' && isAdmin)) && (
        <WriteButton onClick={() => navigate(`/boards/${boardType}/write`)}>글쓰기</WriteButton>
      )}
    </Container>
  );
};

export default BoardPage;