package com.sesac.itall.domain.folder;

import com.sesac.itall.domain.folder_category.FolderCategory;
import com.sesac.itall.domain.folder_category.FolderCategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolderService {

    private final FolderRepository folderRepository;

    /**
     * 폴더 생성
     * @param name 폴더 이름
     * @param category 폴더가 속한 카테고리
     * @param parentFolder 부모 폴더 (최상위 폴더인 경우 null)
     * @return 생성된 폴더
     */
    @Transactional
    public Folder createFolder(String name, FolderCategory category, Folder parentFolder) {
        Folder folder = new Folder(name, category);

        // 부모 폴더가 있는 경우 설정
        if (parentFolder != null) {
            folder.setParentFolder(parentFolder);
            parentFolder.addChildFolder(folder);
        }

        // 카테고리에 폴더 추가
        category.addFolder(folder);

        return folderRepository.save(folder);
    }

    /**
     * 폴더 ID로 폴더 조회
     * @param folderId 폴더 ID
     * @return 폴더
     * @throws EntityNotFoundException 폴더가 존재하지 않는 경우
     */
    public Folder getFolderById(Long folderId) {
        return folderRepository.findById(folderId)
                .orElseThrow(() -> new EntityNotFoundException("폴더를 찾을 수 없습니다. ID: " + folderId));
    }

    /**
     * 카테고리에 속한 최상위 폴더 목록 조회
     * @param categoryId 카테고리 ID
     * @return 폴더 응답 DTO 목록
     */
    public List<FolderResponseDTO> getRootFoldersByCategoryId(Long categoryId) {
        List<Folder> rootFolders = folderRepository.findByFolderCategoryIdAndParentFolderIsNull(categoryId);
        return rootFolders.stream()
                .map(FolderResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * 폴더 이름 수정
     * @param folderId 폴더 ID
     * @param newName 새 폴더 이름
     * @return 수정된 폴더
     * @throws EntityNotFoundException 폴더가 존재하지 않는 경우
     */
    @Transactional
    public Folder updateFolder(Long folderId, String newName) {
        Folder folder = getFolderById(folderId);
        folder.setName(newName);
        return folderRepository.save(folder);
    }

    /**
     * 폴더 삭제
     * @param folderId 폴더 ID
     * @throws EntityNotFoundException 폴더가 존재하지 않는 경우
     */
    @Transactional
    public void deleteFolder(Long folderId) {
        Folder folder = getFolderById(folderId);

//        // 폴더에 게시글이 있는지 확인
//        if (!folder.getPost().isEmpty()) {
//            throw new IllegalStateException("폴더 내에 게시글이 있어 삭제할 수 없습니다.");
//        }
//
//        // 자식 폴더가 있는지 확인
//        if (!folder.getChildFolderList().isEmpty()) {
//            throw new IllegalStateException("하위 폴더가 있어 삭제할 수 없습니다.");
//        }

        folderRepository.delete(folder);
    }
}
