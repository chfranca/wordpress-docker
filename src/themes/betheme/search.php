<?php
/**
 * The search template file.
 *
 * @package Betheme
 * @author Muffin group
 * @link https://muffingroup.com
 */

get_header();

$is_live_search = false;

if( mfn_opts_get('header-search-live') && isset( $_GET['mfn_livesearch'] ) ){
	$is_live_search = true;
}

$translate['search-title'] = mfn_opts_get('translate') ? mfn_opts_get('translate-search-title','Ooops...') : __('Ooops...','betheme');
$translate['search-subtitle'] = mfn_opts_get('translate') ? mfn_opts_get('translate-search-subtitle','No results found for:') : __('No results found for:','betheme');

$translate['published']	= mfn_opts_get('translate') ? mfn_opts_get('translate-published','Published by') : __('Published by','betheme');
$translate['at'] = mfn_opts_get('translate') ? mfn_opts_get('translate-at','at') : __('at','betheme');
$translate['readmore'] = mfn_opts_get('translate') ? mfn_opts_get('translate-readmore','Read more') : __('Read more','betheme');
?>

<div id="Content">
	<div class="content_wrapper clearfix">

		<div class="sections_group">

			<div class="section">
				<div class="section_wrapper clearfix">

					<?php if( have_posts() && trim( $_GET['s'] ) ): ?>

						<div class="column one column_blog">
							<div class="blog_wrapper isotope_wrapper">

								<div class="posts_group <?php if( $is_live_search ){ echo 'lm_wrapper'; } ?>">

									<?php
										while ( have_posts() ):

											the_post();

											$has_image = 'no-image';
											if( $is_live_search && mfn_opts_get('header-search-live-featured_image') && get_the_post_thumbnail_url() ){
												$has_image = 'has-image';
											}
									?>

									<div id="post-<?php the_ID(); ?>" <?php post_class( array('search-item', 'clearfix', $has_image) ); ?>>

										<?php if( 'has-image' === $has_image ): ?>
											<div class="post-featured-image">
												<?php the_post_thumbnail( 'blog-portfolio', array( 'class' => 'scale-with-grid' )); ?>
											</div>
										<?php endif; ?>

										<div class="search-content">

											<?php if( mfn_opts_get( 'blog-meta' ) ): ?>
												<div class="post-meta clearfix">
													<div class="author-date">
														<span class="author"><span><?php echo esc_html($translate['published']); ?> </span><i class="icon-user"></i> <a href="<?php echo esc_url(get_author_posts_url(get_the_author_meta('ID'))); ?>"><?php the_author_meta('display_name'); ?></a></span>
														<span class="date"><span><?php echo esc_html($translate['at']); ?> </span><i class="icon-clock"></i> <?php echo esc_html(get_the_date()); ?></span>
													</div>
												</div>
											<?php endif; ?>

											<div class="post-title">
												<h4><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h4>
											</div>

											<?php
												global $product;
												if( $product ):
											?>
												<div class="post-product-price">
													<?php
													 $price = $product->get_price() ? $product->get_price() . get_woocommerce_currency() : '';
													 echo $price;
													?>
												</div>
											<?php endif; ?>

											<div class="post-excerpt">
												<?php the_excerpt(); ?>
											</div>

											<div class="post-footer">
												<div class="post-links">
													<i class="icon-doc-text"></i> <a href="<?php the_permalink(); ?>" class="post-more"><?php echo esc_html($translate['readmore']); ?></a>
												</div>
											</div>

										</div>

									</div>

									<?php endwhile;	?>

								</div>

								<?php
									if ( $is_live_search ):
										echo '<div class="mfn-infinite-load-button">'. mfn_pagination(false, '10') .'</div>';
									elseif (function_exists( 'mfn_pagination' )):
										echo mfn_pagination();
									else:
										?>
											<div class="nav-next"><?php next_posts_link(esc_html__('&larr; Older Entries', 'betheme')) ?></div>
											<div class="nav-previous"><?php previous_posts_link(esc_html__('Newer Entries &rarr;', 'betheme')) ?></div>
										<?php
									endif;
								?>

							</div>
						</div>
					<?php else: ?>

						<div class="column one search-not-found">

							<div class="snf-pic">
								<i class="themecolor icon-search"></i>
							</div>

							<div class="snf-desc">
								<h4><?php echo esc_html($translate['search-title']); ?></h4>
								<p><?php echo esc_html($translate['search-subtitle']) .' '. esc_html($_GET['s']); ?></p>
							</div>

						</div>

					<?php endif; ?>

				</div>
			</div>

		</div>

		<?php get_sidebar(); ?>

	</div>
</div>

<?php get_footer();
