package com.worlabel.domain.workspace.entity;

import com.worlabel.domain.project.entity.Project;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name = "workspace")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Workspace extends BaseEntity {

    /**
     * 워크 스페이스 PK
     */
    @Id
    @Column(name = "workspace_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 워크 스페이스 제목
     */
    @Column(name = "title",nullable = false, length = 50)
    private String title;

    /**
     * 워크 스페이스 설명
     */
    @Column(name = "description", nullable = false,length = 255)
    private String description;

    /**
     * 워크 스페이스에 속한 프로젝트
     */
    @OneToMany(mappedBy = "workspace", fetch = FetchType.LAZY,cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Project> projectList = new ArrayList<>();

}
